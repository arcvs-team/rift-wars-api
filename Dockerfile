FROM node:20-alpine
WORKDIR /usr/src/rift-wars-api
COPY . .
EXPOSE 3333
ENV WAIT_VERSION 2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
