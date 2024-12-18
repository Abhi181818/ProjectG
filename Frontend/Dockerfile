# Stage 1: Build the React app using Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:1.23-alpine

# Copy the built app from the builder stage (make sure it's pointing to the correct build directory)
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure Nginx to listen on port 8080 (modifying default config)
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
