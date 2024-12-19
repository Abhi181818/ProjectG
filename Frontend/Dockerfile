# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Pass environment variables into the build process
ARG VITE_FIREBASE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Inject environment variables and build the app
RUN VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN \
    VITE_PROJECT_ID=$VITE_PROJECT_ID \
    VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET \
    VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID \
    VITE_APP_ID=$VITE_APP_ID \
    VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID \
    npm run build

# Stage 2: Serve the built app
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the built React app
COPY --from=builder /app/dist /app/build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "build", "-l", "8080"]
