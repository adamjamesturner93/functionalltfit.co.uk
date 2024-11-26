#!/bin/bash

echo "Debug: VERCEL_GIT_COMMIT_REF=$VERCEL_GIT_COMMIT_REF"
echo "Debug: VERCEL_GITHUB_DEPLOYMENT=$VERCEL_GITHUB_DEPLOYMENT"
echo "Debug: VERCEL_URL=$VERCEL_URL"
echo "Debug: VERCEL_GIT_COMMIT_AUTHOR_LOGIN=$VERCEL_GIT_COMMIT_AUTHOR_LOGIN"
echo "Debug: VERCEL_GIT_COMMIT_MESSAGE=$VERCEL_GIT_COMMIT_MESSAGE"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] && [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[deploy]"* ]]; then
  echo "Building main branch from GitHub Actions trigger"
  exit 1
else
  echo "Skipping build"
  exit 0
fi