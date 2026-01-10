#!/bin/bash

set -e

# Arguments
PR_NUMBER=$1
PREVIEW_PORT=$2
PREVIEW_URL=$3

if [ -z "$PR_NUMBER" ] || [ -z "$PREVIEW_PORT" ] || [ -z "$PREVIEW_URL" ]; then
  echo "❌ Usage: $0 <pr_number> <preview_port> <preview_url>"
  exit 1
fi

echo "🔧 Configuring Nginx for PR #${PR_NUMBER}"
echo "   - URL: ${PREVIEW_URL}"
echo "   - Port: ${PREVIEW_PORT}"

# Create Nginx configuration
cat > /etc/nginx/sites-available/safe-edu-pr-${PR_NUMBER} <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${PREVIEW_URL};

    location / {
        proxy_pass http://localhost:${PREVIEW_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Verify config file was created
if [ ! -f "/etc/nginx/sites-available/safe-edu-pr-${PR_NUMBER}" ]; then
  echo "❌ ERROR: Config file was not created"
  exit 1
fi

echo "✅ Config file created"

# Enable site
ln -sf /etc/nginx/sites-available/safe-edu-pr-${PR_NUMBER} /etc/nginx/sites-enabled/
echo "✅ Site enabled"

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if ! nginx -t 2>&1; then
  echo "❌ Nginx config test failed!"
  echo "📄 Config content:"
  cat /etc/nginx/sites-available/safe-edu-pr-${PR_NUMBER}
  exit 1
fi

echo "✅ Nginx config test passed"

# Reload Nginx
echo "🔄 Reloading Nginx..."
if ! systemctl reload nginx; then
  echo "❌ Failed to reload Nginx"
  exit 1
fi

echo "✅ Nginx configured successfully for PR #${PR_NUMBER}"
echo "🌐 Preview available at: http://${PREVIEW_URL}"
echo ""
echo "📋 To enable HTTPS, run:"
echo "   certbot --nginx -d ${PREVIEW_URL}"
