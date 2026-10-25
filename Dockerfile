# see all versions at https://hub.docker.com/r/oven/bun/tags
# keep in sync with bun-version in .github/workflows/ci.yml
FROM oven/bun:1.4.2-slim AS base
WORKDIR /usr/src/app

# production dependencies only; no scripts, since "prepare" installs git hooks with dev-only husky
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# only what the server needs at runtime: no .git, tests, docs or dev tooling
FROM base AS release
LABEL org.opencontainers.image.source=https://github.com/mkeverything/mktour-ws-server
COPY --from=install /usr/src/app/node_modules node_modules
COPY package.json tsconfig.json index.ts healthcheck.ts ./
COPY lib lib

USER bun
ENV PORT=7070
EXPOSE 7070/tcp

# requires OPENSTATUS_HEADER in the container environment
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD ["bun", "healthcheck.ts"]

ENTRYPOINT [ "bun", "start" ]
