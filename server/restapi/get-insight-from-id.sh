#!/usr/bin/env bash

set -euo pipefail

URL="http://localhost:8080/insights/2"

echo "Get all insights from $URL"
curl -X GET "$URL"  --fail