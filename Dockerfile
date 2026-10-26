FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run images:check && npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Deployment gates travel with the image; ops/ci-deploy.sh copies them out on the VM.
COPY --from=build /app/scripts/deploy-portfolio.sh /app/scripts/check-image-delivery.py /app/scripts/check-seo.py /app/scripts/prepare-static-compression.py ./deploy/scripts/
COPY --from=build /app/ops/tanzamul-image-delivery.conf ./deploy/ops/
RUN mkdir -p .next/cache/images && chown -R node:node .next/cache
USER node
EXPOSE 3000
CMD ["node", "server.js"]
