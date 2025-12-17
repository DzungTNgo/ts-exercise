#!/usr/bin/env bash

set -euo pipefail

URL="http://localhost:8080/insights/1"

echo "Run Delete test insight to $URL"
curl -sS -X DELETE "$URL" --fail

