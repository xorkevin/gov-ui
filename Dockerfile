FROM node:alpine
MAINTAINER xorkevin
WORKDIR /app
COPY server/package.json .
COPY server/package-lock.json .
RUN npm install --only=production
COPY server/server.js .
VOLUME ["/app/bin"]
EXPOSE 3030
CMD ["npm", "run", "serve"]
