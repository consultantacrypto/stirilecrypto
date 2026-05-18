# OpenClaw editorial agent — hardened Node.js Alpine image
FROM node:22-alpine AS base

RUN apk add --no-cache dumb-init \
  && addgroup -g 1001 clawgroup \
  && adduser -D -u 1001 -G clawgroup clawuser

WORKDIR /home/clawuser/app

# Install dependencies as root, then hand ownership to clawuser
COPY --chown=clawuser:clawgroup package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY --chown=clawuser:clawgroup . .

USER clawuser

ENV NODE_ENV=production \
  HOME=/home/clawuser \
  OPENCLAW_WORKSPACE=/home/clawuser/.openclaw/workspace

EXPOSE 18789

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
