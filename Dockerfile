# Start from a lightweight Node.js image.
# Base stage: Set nodejs image as base and set the working directory in this stage.
FROM node:20-alpine AS base
# Set environment variables for pnpm, enable corepack for installing pnpm when required, and add pnpm to the PATH.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g typescript
# Set the working directory in the container and copy the package.json file first for installing dependencies.
# This allows Docker to cache the layer with installed dependencies, so if package.json doesn't change, 
# it won't need to reinstall dependencies on subsequent builds.
WORKDIR /app

# Shared service: build the shared service for both frontend and backend.
FROM base AS shared-build

WORKDIR /app
COPY pnpm-workspace.yaml package.json ./

WORKDIR /app/shared/
COPY shared/package.json ./
RUN pnpm install

COPY shared/tsconfig.json ./
COPY shared/src ./src
RUN --mount=type=bind,source=shared/src,target=/app/shared/src pnpm run build

# backend service: build the backend service using the shared service.
FROM base AS backend-build
RUN npm install -g @nestjs/cli

WORKDIR /app
COPY --from=shared-build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=shared-build /app/node_modules ./node_modules
COPY --from=shared-build /app/shared ./shared

WORKDIR /app/apps/backend/main-app/
COPY apps/backend/main-app/package.json ./
RUN pnpm install

COPY apps/backend/main-app/tsconfig.json ./
COPY apps/backend/main-app/src ./src

WORKDIR /app
EXPOSE 3000
CMD ["pnpm", "run", "et-backend", "start:dev"]

# frontend service: build the frontend service using the shared service.
FROM base AS frontend-build
RUN npm i -g npm-run-all @tanstack/router-cli

WORKDIR /app
COPY --from=shared-build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=shared-build /app/node_modules ./node_modules
COPY --from=shared-build /app/shared ./shared

WORKDIR /app/apps/frontend/et-web/
COPY apps/frontend/et-web/package.json ./
RUN pnpm install
COPY apps/frontend/et-web ./

WORKDIR /app
EXPOSE 4200
CMD ["pnpm", "run", "et-web", "dev"]
# "ls",  "-la", "/app/node_modules/.pnpm/@tanstack+router-cli@1.160.0/node_modules", "&&", 