FROM node:18

WORKDIR /rema

RUN mkdir ./app
RUN mkdir ./data

COPY package*.json ./

RUN npm install

COPY ./dist ./app

ENV PORT=3000

EXPOSE 3000:3000

WORKDIR /rema/app

CMD [ "node", "app.js"]