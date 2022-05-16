'use strict';
require('dotenv').config();
const mongoose = require("mongoose");

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

module.exports = {connect, disconnect}
