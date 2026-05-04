# Start from a lightweight Node.js image.
# Base stage: Set nodejs image as base and set the working directory in this stage.
FROM dhi.io/node:20-alpine3.23-dev AS base
# Set environment variables for pnpm, enable corepack for installing pnpm when required, and add pnpm to the PATH.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g typescript

# Shared service: build the shared service for both frontend and backend.
FROM base AS workspace-init

WORKDIR /app
COPY pnpm-workspace.yaml package.json ./
RUN pnpm install

FROM workspace-init AS shared-types

WORKDIR /app/types/
COPY types/package.json ./
RUN pnpm install

# Copy all types.
COPY types/tsconfig.json ./
COPY types/src ./src

CMD [ "pnpm", "run", "build:watch" ]

FROM workspace-init AS shared-utils

WORKDIR /app
COPY --from=shared-types /app/types ./types

WORKDIR /app/utils/
COPY utils/package.json ./
RUN pnpm install

COPY utils/tsconfig.json ./
COPY utils/src ./src

CMD [ "pnpm", "run", "build:watch" ]

# backend service: build the backend service using the shared service.
FROM base AS backend-dev
RUN npm install -g @nestjs/cli

WORKDIR /app
COPY --from=workspace-init /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=workspace-init /app/node_modules ./node_modules
COPY --from=shared-types /app/types ./types
COPY --from=shared-utils /app/utils ./utils

WORKDIR /app/apps/backend/main-app/
COPY apps/backend/main-app/package.json ./
RUN pnpm install

COPY apps/backend/main-app ./

WORKDIR /app
EXPOSE 3000

# Debugger PORT.
EXPOSE 9229

CMD ["pnpm", "run", "et-backend", "start:debug"]

# frontend service: build the frontend service using the shared service.
FROM base AS frontend-dev
RUN npm i -g npm-run-all @tanstack/router-cli

WORKDIR /app
COPY --from=workspace-init /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=workspace-init /app/node_modules ./node_modules
COPY --from=shared-types /app/types ./types
COPY --from=shared-utils /app/utils ./utils

WORKDIR /app/apps/frontend/et-web/
COPY apps/frontend/et-web/package.json ./
RUN pnpm install
COPY apps/frontend/et-web ./

WORKDIR /app
EXPOSE 4200
CMD ["pnpm", "run", "et-web", "dev"]
# "ls",  "-la", "/app/node_modules/.pnpm/@tanstack+router-cli@1.160.0/node_modules", "&&", 