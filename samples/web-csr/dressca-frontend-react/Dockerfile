FROM node:22.12.0-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
ENV CYPRESS_INSTALL_BINARY=0
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
