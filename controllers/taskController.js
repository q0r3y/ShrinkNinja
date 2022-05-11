let cron = require('node-cron');
const Link = require("../models/Link");

async function clearExpiredLinks() { // Clears expired links at 1am
  cron.schedule('* * 1 * *', () =>  {
    let today = Date.now();
    Link.deleteMany({ expirationDate: { $lte: today } }).then(function(){
      console.log('[+] Cleared old entries'); // Success
    }).catch(function(error){
      console.log(error); // Failure
    });
    console.log(`[*] Ran scheduled task at ${today}`);
  });
}

module.exports = {clearExpiredLinks}
