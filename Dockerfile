# Use the official Node.js image as the base
FROM node:18-slim

# Install dependencies for running Playwright and xvfb
RUN apt-get update && apt-get install -y wget gnupg2 unzip libgconf-2-4 xvfb \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Allure command-line tool
RUN wget -q https://github.com/allure-framework/allure2/releases/download/2.21.0/allure-2.21.0.tgz -O allure.tgz \
  && tar -xzf allure.tgz -C /opt/ \
  && ln -s /opt/allure-2.21.0/bin/allure /usr/bin/allure \
  && rm allure.tgz

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of your project files
COPY . .

# Set environment variables for running tests in non-headless mode for debugging
ENV HEADLESS=false

# Run tests in xvfb-run for a virtual display
CMD ["sh", "-c", "xvfb-run -a npm run test && allure serve reports"]
