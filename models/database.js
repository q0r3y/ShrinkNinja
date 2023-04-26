'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const Link = require('./Link');
const sanitize = require('mongo-sanitize');

async function connect() {
  let DB_CONNECTION = '';
  if (process.env.NODE_ENV === 'production') {
    DB_CONNECTION = process.env.PROD_DB_CONNECTION;
  } else {
    DB_CONNECTION = process.env.DEV_DB_CONNECTION;
  }
  console.log(`[*] Connecting to mongoDB..`);
  //mongoose.set('debug', true);
  await mongoose
    .connect(DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`[+] Database Connected.`);
    })
    .catch((err) => {
      console.log(`[-] Unable to connect to database.`);
      console.log(err);
    });
}

async function disconnect() {
  await mongoose.disconnect().then(() => {
    console.log('[*] Worker.js: Mongoose database disconnected:');
  });
}

async function isCodeInUse(shortCode) {
  const link = await getLink(shortCode);
  return !!link;
}

async function getLink(shortCode) {
  const cleanShortCode = sanitize(shortCode);
  return await Link.findOne({ shortCode: cleanShortCode }).exec();
}

function newLink(data) {
  const SHORT_URL = 'nin.sh';
  const TEN_DAYS = 10 * 86400000;
  Object.keys(data).forEach((k) => {
    data[k] = sanitize(data[k]);
  });
  return new Link({
    shortCode: data.shortCode,
    longUrl: data.longUrl,
    shortUrl: `${SHORT_URL}/${data.shortCode}`,
    singleUse: data.singleUse || false,
    creationDate: Date.now(),
    expirationDate: Date.now() + TEN_DAYS,
  });
}

async function eraseLink(shortCode) {
  const cleanShortCode = sanitize(shortCode);
  await Link.deleteOne({ shortCode: cleanShortCode });
}

module.exports = {
  connect,
  disconnect,
  getLink,
  isCodeInUse,
  newLink,
  eraseLink,
};
