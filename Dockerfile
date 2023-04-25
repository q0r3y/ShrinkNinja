FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=80
#ENV MONGO_DB_CONNECTION=
CMD ["npm", "start"]