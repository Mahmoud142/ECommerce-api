FROM node:20-slim

WORKDIR /usr/src/app

# Copy the package files
COPY package*.json ./

# Install packages (ignoring dev dependencies like nodemon)
RUN npm install --omit=dev

# Copy all your project files
COPY . .

# The port Express runs on inside the container
EXPOSE 3000

# The command to start your app
CMD ["npm", "start"]
