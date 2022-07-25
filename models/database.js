'use strict';
require('dotenv').config();
const mongoose = require("mongoose");
const Link = require("./Link");

async function connect() {
  console.log(`[*] Connecting to mongoDB..`);
  //mongoose.set('debug', true);
  await mongoose.connect(
    process.env.MONGO_DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
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
  await mongoose.disconnect()
    .then(() => {
      console.log('[*] Worker.js: Mongoose database disconnected:');
    });
}

async function getLink(shortCode) {
  return await Link.findOne({'shortCode': shortCode}).exec();
}

async function isCodeInUse(shortCode) {
  const link = await getLink(shortCode);
  return !!link;
}

function newLink(data) {
  const SHORT_URL = 'nin.sh';
  const TEN_DAYS = (10 * 86400000);
  return new Link({
    shortCode: data.shortCode,
    longUrl: data.longUrl,
    shortUrl: `${SHORT_URL}/${data.shortCode}`,
    singleUse: data.singleUse,
    creationDate: Date.now(),
    expirationDate: Date.now() + TEN_DAYS
  });
}

async function eraseLink(shortCode) {
  await Link.deleteOne({'shortCode': shortCode})
}

module.exports = {connect, disconnect, getLink, isCodeInUse, newLink, eraseLink}
