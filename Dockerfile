# Use the official Node.js runtime as the base image
FROM node:18-alpine

# We declare the backend_url argument for building, for setting the backend server location
ARG backend_url

# Set the backend URL as an enviroment variable for the build process
ENV REACT_APP_BACKEND_URL=$backend_url

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose port 3000
EXPOSE 3000 3001

# Start React when the container runs
CMD ["sh", "-c", "npm start & node proxy.js"]