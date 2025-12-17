#!/usr/bin/env bash

set -euo pipefail

URL="http://localhost:8080/insights"

PAYLOAD=$(cat <<'JSON'
{
  "brand": "brand 2",
  "createdAt": "06 October 2025 14:48 UTC",
  "text": "test 2"
}
JSON
)

echo "Posting test insight to $URL"
curl -sS -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --fail

