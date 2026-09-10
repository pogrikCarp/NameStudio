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

read -r -d '' SITE_ROOT <<'NGINX' || true
    root ${DEPLOY_PATH};
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml application/javascript application/json application/xml image/svg+xml;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    location = /index.html {
        add_header Cache-Control "no-cache";
        add_header X-Content-Type-Options nosniff always;
        add_header Referrer-Policy strict-origin-when-cross-origin always;
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(js|css|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location ~* \.(png|jpg|jpeg|gif|svg|ico|webp|mp4)$ {
        expires 7d;
        add_header Cache-Control "public";
        try_files $uri =404;
    }

    location = /robots.txt {
        add_header Cache-Control "public, max-age=3600";
        try_files $uri =404;
    }

    location = /sitemap.xml {
        add_header Cache-Control "public, max-age=3600";
        try_files $uri =404;
    }
NGINX

# The heredoc above is literal; inject path below via envsubst-style rewrite
SITE_ROOT="${SITE_ROOT//'${DEPLOY_PATH}'/${DEPLOY_PATH}}"

TMP_CONF="$(mktemp)"
if [[ -f "${CERT_DIR}/fullchain.pem" && -f "${CERT_DIR}/privkey.pem" ]]; then
cat > "$TMP_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DEPLOY_DOMAIN} ${DEPLOY_WWW};
    return 301 https://${DEPLOY_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DEPLOY_WWW};

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;

    return 301 https://${DEPLOY_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DEPLOY_DOMAIN};

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;

${SITE_ROOT}
}
EOF
else
cat > "$TMP_CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DEPLOY_WWW};
    return 301 http://${DEPLOY_DOMAIN}\$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DEPLOY_DOMAIN};

${SITE_ROOT}
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
