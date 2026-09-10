#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="${1:-}"
if [[ -z "$SRC_DIR" || ! -d "$SRC_DIR/dist" ]]; then
  echo "Usage: $0 <source_dir_with_dist>" >&2
  exit 1
fi

APP_NAME="${APP_NAME:-namestudio}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/${APP_NAME}}"
DEPLOY_DOMAIN="${DEPLOY_DOMAIN:-namewebstudio.com}"
DEPLOY_WWW="${DEPLOY_WWW:-www.${DEPLOY_DOMAIN}}"
SITE_NAME="${SITE_NAME:-${APP_NAME}.conf}"
CERT_DIR="/etc/letsencrypt/live/${DEPLOY_DOMAIN}"

apt-get update -y
apt-get install -y --no-install-recommends nginx rsync

mkdir -p "$DEPLOY_PATH"
rsync -a --delete "$SRC_DIR/dist/" "$DEPLOY_PATH/"
chown -R www-data:www-data "$DEPLOY_PATH"
find "$DEPLOY_PATH" -type d -exec chmod 755 {} \;
find "$DEPLOY_PATH" -type f -exec chmod 644 {} \;

TMP_CONF="$(mktemp)"
if [[ -f "${CERT_DIR}/fullchain.pem" && -f "${CERT_DIR}/privkey.pem" ]]; then
cat > "$TMP_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DEPLOY_DOMAIN} ${DEPLOY_WWW};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DEPLOY_DOMAIN} ${DEPLOY_WWW};

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;

    root ${DEPLOY_PATH};
    index index.html;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public";
        try_files \$uri =404;
    }
}
EOF
else
cat > "$TMP_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DEPLOY_DOMAIN} ${DEPLOY_WWW};

    root ${DEPLOY_PATH};
    index index.html;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public";
        try_files \$uri =404;
    }
}
EOF
fi

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
cp "$TMP_CONF" "/etc/nginx/sites-available/${SITE_NAME}"
ln -sfn "/etc/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-enabled/${SITE_NAME}"
rm -f /etc/nginx/sites-enabled/default
rm -f "$TMP_CONF"

nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "Deployed ${APP_NAME} -> ${DEPLOY_PATH}"
echo "Open https://${DEPLOY_DOMAIN}/"
