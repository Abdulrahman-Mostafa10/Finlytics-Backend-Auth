FROM node:22.18.0-slim

# Create a secure, non-root user
RUN useradd --create-home --shell /bin/bash cashlytics-backend

# Set working directory (match docker-compose volume)
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (dev + prod for development)
RUN npm install

# Copy the rest of the source code
COPY . .

RUN npm run build

# Adjust file permissions
RUN chown -R cashlytics-backend:cashlytics-backend /app

# Switch to non-root user
USER cashlytics-backend

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose application port
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"]
