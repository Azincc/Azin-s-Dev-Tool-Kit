#!/bin/sh
set -e

if [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_KEY" ]; then
  echo "Purging Cloudflare cache..."
  curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_KEY" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
  echo "Cache purged"
else
  echo "Skipping Cloudflare cache purge"
fi

exec "$@"
