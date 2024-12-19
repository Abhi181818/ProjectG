# Stage 1: Build the React app
FROM node:18-alpine AS builder
WORKDIR /app

# Add build arguments
ARG VITE_FIREBASE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN \
    VITE_PROJECT_ID=$VITE_PROJECT_ID \
    VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET \
    VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID \
    VITE_APP_ID=$VITE_APP_ID \
    VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID

# Build the application
RUN npm run build

# Stage 2: Serve the built application
FROM node:18-alpine
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist /app/build

# Expose port
EXPOSE 8080

# Start the application
CMD ["serve", "-s", "build", "-l", "8080"]