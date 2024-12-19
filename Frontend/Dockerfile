# Stage 1: Build the React app using Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Declare the build-time environment variables
ARG VITE_APP_ID
ARG VITE_AUTH_DOMAIN
ARG VITE_FIREBASE_API_KEY
ARG VITE_MEASUREMENT_ID
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the app
COPY . .

# Set the environment variables for Vite during the build process
RUN echo "VITE_APP_ID=$VITE_APP_ID" > .env
RUN echo "VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN" >> .env
RUN echo "VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY" >> .env
RUN echo "VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID" >> .env
RUN echo "VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID" >> .env
RUN echo "VITE_PROJECT_ID=$VITE_PROJECT_ID" >> .env
RUN echo "VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET" >> .env

# Run the build command (this will use the .env file for Vite)
RUN npm run build

# Stage 2: Serve the built app with 'serve' (a static file server)
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /app/build

# Expose port 8080
EXPOSE 8080

# Start the server to serve the build files
CMD ["serve", "-s", "build", "-l", "8080"]
