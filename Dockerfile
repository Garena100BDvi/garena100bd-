# Multi-stage Dockerfile for Garena API Gateway (Koyeb / Render / Railway / Docker)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configuration
COPY package*.json ./
COPY .npmrc* ./
COPY bun.lock* ./

# Install all dependencies for build
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build client (dist) and server (server.js)
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package*.json ./
COPY .npmrc* ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data

# Expose port (Koyeb automatically sets PORT env var)
EXPOSE 3000

CMD ["node", "server.js"]
