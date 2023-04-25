'use strict';
const Link = require('../models/Link');
const database = require('../models/database');

async function runWorker() {
  await clearOldEntries();
}

async function clearOldEntries() {
  await database
    .connect()
    .then(() => {
      const today = Date.now();
      console.log(`[*] Worker.js: Ran scheduled task at ${today}`);
      Link.deleteMany({ expirationDate: { $lte: today } })
        .then(async function () {
          console.log('[+] Worker.js: Cleared old entries');
          await database.disconnect();
        })
        .catch(async function (err) {
          console.log('[-] Worker.js: Error running scheduled task:');
          console.log(err);
          await database.disconnect();
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

runWorker();
