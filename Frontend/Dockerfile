# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

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
