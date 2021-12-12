FROM node:14.17-alpine@sha256:b8d48b515e3049d4b7e9ced6cedbe223c3bc4a3d0fd02332448f3cdb000faee1
WORKDIR /usr/home
ENV PORT 3000
EXPOSE $PORT

COPY . .
RUN npm install
RUN /usr/home/node_modules/@nestjs/cli/bin/nest.js build

CMD node /usr/home/build/main.js