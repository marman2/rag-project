# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Node.js type definitions
RUN npm install --save-dev @types/node

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Install serve locally
RUN npm install serve

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Command to serve the app
CMD ["node_modules/.bin/serve", "-s", "dist", "-l", "3000"]
