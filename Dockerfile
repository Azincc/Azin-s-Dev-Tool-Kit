# Stage 1: Build the application
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
# Using npm ci for a clean, reproducible install based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Install curl for Cloudflare API calls
RUN apk add --no-cache curl

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx with Cloudflare cache purge
CMD if [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_KEY" ]; then \
      echo "Purging Cloudflare cache..." && \
      curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
        -H "Authorization: Bearer $CF_API_KEY" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}' && \
      echo "Cache purged"; \
    else \
      echo "Skipping Cloudflare cache purge"; \
    fi && \
    nginx -g 'daemon off;'
