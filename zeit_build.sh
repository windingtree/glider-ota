#!/bin/bash
echo "NODE_ENV: $NODE_ENV"
echo "VERCEL_GITHUB_COMMIT_REF : $VERCEL_GITHUB_COMMIT_REF"
echo "VERCEL_GITHUB_DEPLOYMENT: $VERCEL_GITHUB_DEPLOYMENT"
echo "VERCEL_GITHUB_COMMIT_REPO: $VERCEL_GITHUB_COMMIT_REPO"
echo "VERCEL_GITHUB_COMMIT_ORG: $VERCEL_GITHUB_COMMIT_ORG"
echo "VERCEL_GITHUB_REPO: $VERCEL_GITHUB_REPO"
echo "VERCEL_GITHUB_COMMIT_SHA: $VERCEL_GITHUB_COMMIT_SHA"

# Create the build according to the branch name
case "$VERCEL_GITHUB_COMMIT_REF" in
develop)  echo "Building $VERCEL_GITHUB_COMMIT_REF"
    yarn build:staging
    ;;
master)  echo "Building $VERCEL_GITHUB_COMMIT_REF"
    yarn build:production
    ;;
preview)  echo "Building $VERCEL_GITHUB_COMMIT_REF"
    yarn build:production
    ;;
*) echo "No build configured for this branch. Assuming staging"
    yarn build:staging
    ;;
esac