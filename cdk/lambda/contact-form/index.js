const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const ses = new SESClient({ region: 'us-east-1' });
const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });

// Configuration from environment variables
const SENDER = process.env.SENDER_EMAIL;
const RECEIVER = process.env.RECEIVER_EMAIL;
const SUBJECT = process.env.EMAIL_SUBJECT || 'Contact Form Submission';

// reCAPTCHA Enterprise configuration
const RECAPTCHA_API_KEY_SECRET_NAME = process.env.RECAPTCHA_API_KEY_SECRET_NAME;
const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const RECAPTCHA_SCORE_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

// Cache the API key to avoid fetching on every request
let cachedApiKey = null;

// Maximum accepted lengths for each field (defense against abuse on a public endpoint)
const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, payload) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    };
}

// Validate the submission server-side. The client checks are advisory only:
// the Function URL is public (authType NONE), so every field must be re-checked here.
function validateSubmission(body) {
    if (!body || typeof body !== 'object') {
        return 'Missing request body';
    }
    for (const field of ['name', 'email', 'subject', 'message']) {
        const value = body[field];
        if (typeof value !== 'string' || value.trim() === '') {
            return `Missing required field: ${field}`;
        }
        if (value.length > MAX_LENGTHS[field]) {
            return `Field exceeds maximum length: ${field}`;
        }
    }
    if (!EMAIL_RE.test(body.email)) {
        return 'Invalid email address';
    }
    if (typeof body.recaptchaToken !== 'string' || body.recaptchaToken === '') {
        return 'Missing reCAPTCHA token';
    }
    return null;
}

async function getRecaptchaApiKey() {
    if (cachedApiKey) {
        return cachedApiKey;
    }
    const command = new GetSecretValueCommand({ SecretId: RECAPTCHA_API_KEY_SECRET_NAME });
    const response = await secretsManager.send(command);
    cachedApiKey = response.SecretString;
    return cachedApiKey;
}

exports.handler = async function (event) {
    // Do not log the raw event: it contains visitor PII (name, email, message).
    console.log('Contact form submission received');

    // Parse body if it's a string (from API Gateway or Function URL)
    let body = event;
    if (typeof event.body === 'string') {
        try {
            body = JSON.parse(event.body);
        } catch (error) {
            console.warn('Malformed JSON body:', error.message);
            return jsonResponse(400, { result: 'Failed', reason: 'Invalid request body' });
        }
    } else if (event.body) {
        body = event.body;
    }

    // Validate input before spending a reCAPTCHA assessment or SES call
    const validationError = validateSubmission(body);
    if (validationError) {
        console.warn('Validation failed:', validationError);
        return jsonResponse(400, { result: 'Failed', reason: validationError });
    }

    // Verify reCAPTCHA token
    try {
        const apiKey = await getRecaptchaApiKey();
        const recaptchaResult = await verifyRecaptcha(body.recaptchaToken, 'contact_submit', apiKey);

        if (!recaptchaResult.success) {
            console.log('reCAPTCHA verification failed:', recaptchaResult.reason);
            return jsonResponse(400, { result: 'Failed', reason: 'reCAPTCHA verification failed' });
        }

        if (recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
            console.log('reCAPTCHA score too low:', recaptchaResult.score);
            return jsonResponse(400, { result: 'Failed', reason: 'Submission blocked' });
        }

        console.log('reCAPTCHA passed with score:', recaptchaResult.score);

    } catch (error) {
        console.error('reCAPTCHA error:', error);
        return jsonResponse(500, { result: 'Failed', reason: 'reCAPTCHA service error' });
    }

    // Send email
    try {
        await sendEmail(body);
        console.log('Email sent successfully');
        return jsonResponse(200, { result: 'Success' });
    } catch (error) {
        console.error('Email error:', error);
        return jsonResponse(500, { result: 'Failed', reason: 'Email service error' });
    }
};

async function verifyRecaptcha(token, expectedAction, apiKey) {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: {
                token,
                siteKey: RECAPTCHA_SITE_KEY,
                expectedAction
            }
        })
    });

    const data = await response.json();
    // Log only the assessment outcome, not the full response (it echoes token data)
    console.log('reCAPTCHA assessment:', JSON.stringify({
        valid: data.tokenProperties?.valid,
        action: data.tokenProperties?.action,
        score: data.riskAnalysis?.score,
        error: data.error?.message,
    }));

    if (data.error) {
        return { success: false, reason: data.error.message };
    }

    const tokenValid = data.tokenProperties?.valid === true;
    const actionMatch = data.tokenProperties?.action === expectedAction;
    const score = data.riskAnalysis?.score || 0;

    if (!tokenValid) {
        return { success: false, reason: 'Invalid token', score: 0 };
    }
    if (!actionMatch) {
        return { success: false, reason: 'Action mismatch', score };
    }
    return { success: true, score };
}

async function sendEmail(event) {
    const params = {
        Destination: {
            ToAddresses: [RECEIVER]
        },
        Message: {
            Body: {
                Text: {
                    Data: `From: ${event.name}\n\nEmail: ${event.email}\n\nSubject: ${event.subject}\n\nMessage: ${event.message}`,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: SUBJECT,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER,
        // Replies go to the person who filled out the form, not the verified sender identity
        ReplyToAddresses: [event.email]
    };

    const command = new SendEmailCommand(params);
    return ses.send(command);
}
