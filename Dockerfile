FROM node:alpine
MAINTAINER xorkevin
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --only=production
COPY server.js .
COPY adminserver.js .
COPY hyperserver.js .
VOLUME ["/app/bin", "/app/bin_admin", "/app/bin_server"]
EXPOSE 3030
EXPOSE 3031
CMD ["npm", "run", "serve"]
