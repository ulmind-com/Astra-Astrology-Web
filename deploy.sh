#!/usr/bin/env bash
set -e

# Astra-Astrology-Web Local Deploy Script
cd "$(dirname "$0")"

echo "🚀 Deploying Astra-Astrology-Web directly to Vercel Production..."
npx vercel --prod --yes
