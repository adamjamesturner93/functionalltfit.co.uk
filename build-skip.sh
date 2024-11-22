#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] && [[ "$VERCEL_GITHUB_DEPLOYMENT" == "1" ]]; then
  echo "Building main branch from GitHub Actions trigger"
  exit 1
else
  echo "Skipping build"
  exit 0
fi