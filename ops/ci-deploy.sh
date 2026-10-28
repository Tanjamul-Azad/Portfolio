#!/usr/bin/env bash
set -euo pipefail

# Forced command for the GitHub Actions deploy key, installed on the VM as
# /usr/local/sbin/tanzamul-ci-deploy. authorized_keys pins the key to:
#   command="sudo -n /usr/local/sbin/tanzamul-ci-deploy \"$SSH_ORIGINAL_COMMAND\"",restrict
# The workflow streams `docker save | gzip` on stdin and passes only the commit SHA.
sha=${1:-}
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'Expected a 40-character commit SHA' >&2; exit 2; }
[[ $(id -u) == 0 ]] || { echo 'Run with sudo' >&2; exit 2; }
exec 9>/run/tanzamul-ci-deploy.lock
flock -n 9 || { echo 'Another deployment is running' >&2; exit 2; }

root=/home/User/tanzamul-portfolio
site=/etc/nginx/sites-available/tanzamul.dev
image=tanzamul-portfolio:ci-$sha

# The disk is small: keep the live container plus the newest stopped one for
# rollback, the images those two use, and the newest two Nginx config backups.
# Other apps on this VM share Docker, so never prune beyond this site's own.
prune() {
  docker ps -a --filter 'name=^tanzamul-portfolio-' --format '{{.CreatedAt}}	{{.Names}}' \
    | sort -r | tail -n +2 | cut -f2 | xargs -r docker rm -f >/dev/null
  local used
  used=$(docker ps -a --format '{{.Image}}' | sort -u)
  docker images tanzamul-portfolio --filter dangling=false --format '{{.Repository}}:{{.Tag}}' \
    | { grep -vxF -f <(printf '%s\n' "$used") || true; } | xargs -r docker rmi >/dev/null
  { ls -1t "$site".before-* /etc/nginx/snippets/tanzamul-image-delivery.conf.before-* 2>/dev/null || true; } \
    | awk -F'.before-' '{ if (++seen[$1] > 2) print }' | xargs -r rm -f
}

# Prune first so the new image fits, and again once the swap has made the old
# live container the newest rollback.
prune
gunzip | docker load
docker image inspect "$image" >/dev/null

# Run the gate scripts that shipped with this build, not whatever is on disk.
holder=$(docker create "$image")
trap 'docker rm -f "$holder" >/dev/null' EXIT
docker cp "$holder":/app/deploy/scripts/. "$root/scripts/"
docker cp "$holder":/app/deploy/ops/. "$root/ops/"
chown -R --reference="$root" "$root/scripts" "$root/ops"
chmod +x "$root/scripts/deploy-portfolio.sh"

# Alternate between the two loopback ports so the old container keeps serving
# until the new one has passed every gate.
current=$(grep -oE 'proxy_pass http://127\.0\.0\.1:[0-9]+' "$site" | grep -oE '[0-9]+$' | head -1)
port=3008
[[ "$current" != 3008 ]] || port=3009
"$root/scripts/deploy-portfolio.sh" "$image" "$port"
prune
df -h / | tail -1
