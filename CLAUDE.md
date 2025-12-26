# mitchellmeffert.com

Personal portfolio website for Mitchell Meffert.

## AWS Configuration

**This is a personal project - NOT a Roundhouse business project.**

| Setting | Value |
|---------|-------|
| AWS Account | 241654197557 |
| AWS Profile | `personal` |
| Region | us-east-1 |
| Domain | mitchellmeffert.com (Route 53 in same account) |

Always use `--profile personal` or set `AWS_PROFILE=personal` when running AWS/CDK commands for this project.

## CDK Deployment

```bash
cd cdk
npm install
export AWS_PROFILE=personal
npm run bootstrap   # First time only
npm run deploy
```

## GitHub Actions

The deploy workflow uses OIDC authentication. After CDK deploy, add the GitHub secret:
- Secret name: `AWS_ROLE_ARN`
- Value: Role ARN from CDK stack outputs
