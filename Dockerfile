# Last stable version
FROM node:12.16.2

# Container work directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install always the last version of npm
RUN npm install -g npm@latest
RUN npm install

# Bundle app source
COPY . .

# Application port
EXPOSE 3000

CMD [ "npm", "run", "start" ]