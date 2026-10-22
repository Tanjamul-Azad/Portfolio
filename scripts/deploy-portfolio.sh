#!/usr/bin/env bash
set -euo pipefail

# Run as root on the existing deployments VM after building the named image.
image=${1:?Usage: deploy-portfolio.sh tanzamul-portfolio:TAG PORT}
port=${2:?A free loopback port is required}
[[ "$image" =~ ^tanzamul-portfolio:[a-z0-9-]+$ ]] || exit 2
[[ "$port" =~ ^3[0-9]{3}$ && "$port" -ge 3008 ]] || exit 2
[[ $(id -u) == 0 ]] || { echo 'Run with sudo'; exit 2; }
[[ $(df --output=avail -k / | tail -1) -ge 524288 ]] || { echo 'Insufficient free disk space'; exit 2; }
if ss -ltn "sport = :$port" | tail -n +2 | grep -q .; then echo 'Port is already in use'; exit 2; fi

root=/home/User/tanzamul-portfolio
site=/etc/nginx/sites-available/tanzamul.dev
stamp=$(date +%Y%m%d%H%M%S)
candidate=tanzamul-portfolio-candidate-$stamp
previous=tanzamul-portfolio-before-$stamp
backup=$site.before-$stamp
cp "$site" "$backup"

rollback() {
  set +e
  echo "Deployment failed; restoring $backup"
  cp "$backup" "$site"
  if nginx -t; then systemctl reload nginx; fi
  # The old container is kept until the new route has passed validation.
  if docker inspect "$previous" >/dev/null 2>&1; then
    docker update --restart=unless-stopped "$previous" >/dev/null
    docker start "$previous" >/dev/null
  else
    docker update --restart=unless-stopped tanzamul-portfolio >/dev/null
    docker start tanzamul-portfolio >/dev/null
  fi
  if docker inspect "$candidate" >/dev/null 2>&1; then
    docker update --restart=no "$candidate" >/dev/null
    docker stop "$candidate" >/dev/null
  fi
}
trap rollback ERR

docker run -d --name "$candidate" --restart unless-stopped --memory=768m --memory-swap=1g --cpus=1 \
  --env-file /home/User/tanzamul-runtime.env \
  --mount type=volume,source=tanzamul-next-image-cache,target=/app/.next/cache/images \
  -p "127.0.0.1:$port:3000" "$image"
curl -fsS --retry 12 --retry-all-errors --retry-delay 2 "http://127.0.0.1:$port/" -o /tmp/tanzamul-candidate.html
grep -q '/images/optimized/' /tmp/tanzamul-candidate.html
python3 "$root/scripts/check-image-delivery.py" --base "http://127.0.0.1:$port"
python3 "$root/scripts/check-seo.py" --base "http://127.0.0.1:$port" > /tmp/tanzamul-candidate-seo.json
echo 'SEO gate passed: sitemap pages, static archive links, metadata, JSON-LD, and real 404s'

mkdir -p /var/www/tanzamul-assets/optimized /var/www/tanzamul-assets/tech-icons /var/www/tanzamul-assets/next-static
docker cp tanzamul-portfolio:/app/.next/static/. /var/www/tanzamul-assets/next-static/
if docker exec tanzamul-portfolio test -d /app/public/images/optimized; then
  docker cp tanzamul-portfolio:/app/public/images/optimized/. /var/www/tanzamul-assets/optimized/
fi
docker cp "$candidate":/app/public/images/optimized/. /var/www/tanzamul-assets/optimized/
docker cp "$candidate":/app/public/images/tech-icons/. /var/www/tanzamul-assets/tech-icons/
docker cp "$candidate":/app/.next/static/. /var/www/tanzamul-assets/next-static/
chmod -R a+rX /var/www/tanzamul-assets
cp "$root/ops/tanzamul-image-delivery.conf" /etc/nginx/snippets/tanzamul-image-delivery.conf
if ! grep -q 'include /etc/nginx/snippets/tanzamul-image-delivery.conf;' "$site"; then
  sed -i '\|    location / {|i\    include /etc/nginx/snippets/tanzamul-image-delivery.conf;' "$site"
fi
sed -i -E "s|proxy_pass http://127\.0\.0\.1:[0-9]+;|proxy_pass http://127.0.0.1:$port;|" "$site"
nginx -t
systemctl reload nginx

ready=false
for attempt in {1..10}; do
  if curl -fsS https://tanzamul.dev/ -o /tmp/tanzamul-live.html && grep -q '/images/optimized/' /tmp/tanzamul-live.html; then ready=true; break; fi
  sleep 2
done
[[ "$ready" == true ]]
docker update --restart=no tanzamul-portfolio >/dev/null
docker stop tanzamul-portfolio >/dev/null
docker rename tanzamul-portfolio "$previous"
docker rename "$candidate" tanzamul-portfolio
trap - ERR
echo "DEPLOYED $image on localhost:$port; rollback=$previous; config=$backup"
