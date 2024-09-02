FROM node:20-slim

RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    unzip \
    libgconf-2-4 \
    libnss3 \
    libatk1.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxss1 \
    libxtst6 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libnss3-tools \
    libgtk-3-0 \
    libx11-xcb1 \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npx playwright install --with-deps

COPY . .

ENV HEADLESS=true

CMD ["npm", "run", "test:headless"]
