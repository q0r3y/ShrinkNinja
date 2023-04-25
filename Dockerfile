FROM node:18-alpine

WORKDIR /app
COPY . .

ENV PORT=80

RUN npm install --production

CMD ["npm", "start"]