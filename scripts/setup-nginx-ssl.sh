#!/bin/bash

set -e

DOMAIN="safe-edu.site"
APP_PORT=3002
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

echo "🔧 Setting up Nginx and SSL for ${DOMAIN}"

# Check if Nginx config already exists
if [ -f "$NGINX_CONF" ]; then
  echo "✅ Nginx config for ${DOMAIN} already exists, skipping creation..."
else
  echo "📝 Creating Nginx configuration for ${DOMAIN}..."

  cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

  echo "✅ Nginx config created"
fi

# Enable site if not already enabled
if [ ! -L "$NGINX_ENABLED" ]; then
  echo "🔗 Enabling site..."
  ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
  echo "✅ Site enabled"
else
  echo "✅ Site already enabled, skipping..."
fi

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if ! nginx -t 2>&1; then
  echo "❌ Nginx config test failed!"
  exit 1
fi
echo "✅ Nginx config test passed"

# Reload Nginx
echo "🔄 Reloading Nginx..."
systemctl reload nginx

# Check if SSL certificate already exists
if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  echo "✅ SSL certificate for ${DOMAIN} already exists, skipping certbot..."
else
  echo "🔐 Obtaining SSL certificate with Certbot..."

  # Check if certbot is installed
  if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt-get update -qq
    apt-get install -y -qq certbot python3-certbot-nginx
  fi

  # Obtain SSL certificate
  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect

  echo "✅ SSL certificate obtained and configured"
fi

echo ""
echo "🎉 Nginx and SSL setup completed for ${DOMAIN}"
echo "🌐 Site available at: https://${DOMAIN}"
