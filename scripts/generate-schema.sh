#!/bin/bash

# WARNING: Run this script only via `npm run generate:schema`
# Calling it directly may cause incorrect path resolutions for .env and output files.

# This script generates TypeScript types from an OpenAPI schema using openapi-typescript.
# It reads the API URL from a .env file in the project root.

# Load API URL from .env using dotenv-cli and assign it to API_URL
API_URL=$(npx dotenv-cli -e .env -- sh -c 'echo $NEXT_PUBLIC_TWINS_API_URL')

# Check if API_URL is set; exit with an error if not
if [ -z "$API_URL" ]; then
  echo "Error: NEXT_PUBLIC_TWINS_API_URL is not set in .env or dotenv-cli could not load it."
  exit 1
fi

# Confirm the API URL
echo "Using API URL: $API_URL/api-docs/twins-api"

# Run openapi-typescript with the retrieved URL and output the generated types
npx openapi-typescript "$API_URL/api-docs/twins-api" -o ./src/shared/api/generated/schema.d.ts
