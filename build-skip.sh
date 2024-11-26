#!/bin/bash

echo "Debug: VERCEL_GIT_COMMIT_REF=$VERCEL_GIT_COMMIT_REF"
echo "Debug: VERCEL_GITHUB_DEPLOYMENT=$VERCEL_GITHUB_DEPLOYMENT"
echo "Debug: VERCEL_URL=$VERCEL_URL"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] && [[ -n "$VERCEL_GITHUB_DEPLOYMENT" ]]; then
  echo "Building main branch from GitHub Actions trigger"
  exit 1
elif [[ -n "$VERCEL_URL" ]]; then
  echo "Building from deploy hook"
  exit 1
else
  echo "Skipping build"
  exit 0
fi