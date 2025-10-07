#!/bin/bash

set -e

PR_NUMBER=$1

if [ -z "$PR_NUMBER" ]; then
  echo "❌ Usage: $0 <pr_number>"
  echo "Example: $0 44"
  exit 1
fi

echo "🧹 Cleaning up Safe Edu PR #${PR_NUMBER}..."

# Stop and remove container
echo "🛑 Stopping preview container..."
docker stop safe-edu-pr-${PR_NUMBER} 2>/dev/null || echo "   Container not running"
docker rm safe-edu-pr-${PR_NUMBER} 2>/dev/null || echo "   Container not found"

# Remove image
echo "🗑️  Removing preview image..."
docker rmi ghcr.io/sawsew467/safe-edu-front-end:pr-${PR_NUMBER} 2>/dev/null || echo "   Image not found"

# Remove env file
echo "🗑️  Removing environment file..."
rm -f /root/safe-edu-front-end/.env.pr-${PR_NUMBER}

# Remove Nginx config
echo "🔧 Removing Nginx configuration..."
rm -f /etc/nginx/sites-available/safe-edu-pr-${PR_NUMBER}
rm -f /etc/nginx/sites-enabled/safe-edu-pr-${PR_NUMBER}

# Reload Nginx
echo "🔄 Reloading Nginx..."
if nginx -t 2>/dev/null; then
  systemctl reload nginx
  echo "✅ Nginx reloaded successfully"
else
  echo "⚠️  Nginx config has errors"
  nginx -t
fi

echo ""
echo "✅ Cleanup completed for Safe Edu PR #${PR_NUMBER}"
echo ""
echo "📊 Remaining PR containers:"
docker ps --filter "name=safe-edu-pr-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
