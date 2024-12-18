# Stage 1: Build the React app using Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the app
COPY . .
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
