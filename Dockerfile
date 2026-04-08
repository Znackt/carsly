# ------------------------------
# 1️⃣ Base Image
# ------------------------------
    FROM node:20-alpine

    # Set working directory
    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy rest of the project files
    COPY . .
    
    # Set environment to development
    ENV NODE_ENV=development
    
    # Expose port 3000
    EXPOSE 3000
    
    # Run Next.js in dev mode
    CMD ["npm", "run", "dev"]
    