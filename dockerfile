FROM node:20-alpine3.17
WORKDIR /nodeApp
COPY  package.json .
RUN npm i
COPY  . .
CMD [ "npm","run","dev" ]
EXPOSE 3000