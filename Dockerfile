# # Base image
# FROM node:18-alpine AS base
# WORKDIR /app

# # Dependencies stage
# FROM base AS deps
# # Copy package files and prisma schema
# COPY package.json package-lock.json ./
# COPY prisma/schema.prisma ./prisma/schema.prisma

# # Install dependencies
# RUN npm install -g npm@10.9.1
# # Generate Prisma Client with specific schema path
# RUN npx prisma generate --schema=./prisma/schema.prisma

# # Builder stage
# FROM base AS builder
# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /app/prisma ./prisma
# COPY . .

# # Generate Prisma Client for build
# RUN npx prisma generate --schema=./prisma/schema.prisma
# RUN npm run build

# # Builder stage
# ARG DATABASE_URL
# ARG NEXT_PUBLIC_SUPABASE_URL
# ENV DATABASE_URL=${DATABASE_URL}
# ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}

# # Runner stage
# FROM base AS runner
# ENV NODE_ENV production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Copy necessary files
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# USER nextjs

# ENV PORT 3000
# ENV HOSTNAME "0.0.0.0"

# # Ensure prisma client is available
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# CMD ["node", "server.js"]

# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies dan type declarations
RUN npm install -g npm@10.9.1
RUN npm ci
RUN npm install --save-dev @types/bcryptjs
RUN npx prisma generate

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build time environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG DATABASE_URL

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client dan build aplikasi
RUN npx prisma generate
RUN npm run build

# Runner stage
FROM base AS runner
ENV NODE_ENV production

# Buat user untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file yang diperlukan
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]