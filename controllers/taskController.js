const cron = require('node-cron');
const Link = require("../models/Link");

function clearExpiredLinks() { // Clears expired links at 1am
  cron.schedule('* * 1 * *', () =>  {
    const today = Date.now();
    Link.deleteMany({ expirationDate: { $lte: today } })
      .then(function(){
        console.log('[+] Cleared old entries');
      })
      .catch(function(error){
        console.log(error);
      });
    console.log(`[*] Ran scheduled task at ${today}`);
  });
}

module.exports = {clearExpiredLinks}
