# FROM node:18.0.0-alpine 
# WORKDIR /usr/src/app
# COPY package.json ./
# RUN npm install
# COPY . .
# expose 3000
# CMD ["node","server.js"]

# FROM node
# WORKDIR /home/node/app
# COPY package.json ./
# # RUN npm install
# COPY . ./
# CMD ["node","server.js"]
# expose 3000

FROM node
WORKDIR /
COPY package.json /
RUN npm install
COPY . /
# COPY Pieces/ ./Pieces/
CMD ["node","server.js"]
expose 3000

# for Chrome
run npx puppeteer browsers install chrome

# install google chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable

# install chromedriver
RUN apt-get install -yqq unzip
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/