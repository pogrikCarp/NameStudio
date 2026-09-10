#!/usr/bin/env bash
set -euo pipefail

DOMAIN="namewebstudio.com"
WWW="www.${DOMAIN}"
ROOT="/var/www/namestudio"
SITE="/etc/nginx/sites-available/namestudio.conf"

apt-get update -y
apt-get install -y --no-install-recommends nginx certbot python3-certbot-nginx

cat > "$SITE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW};

    root ${ROOT};
    index index.html;

    location /.well-known/acme-challenge/ {
        root ${ROOT};
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sfn "$SITE" /etc/nginx/sites-enabled/namestudio.conf
nginx -t
systemctl enable --now nginx
systemctl reload nginx

certbot --nginx -d "$DOMAIN" -d "$WWW" \
  --non-interactive --agree-tos --register-unsafely-without-email --redirect

nginx -t
systemctl reload nginx

echo "HTTPS ready: https://${DOMAIN}/"
