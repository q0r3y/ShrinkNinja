const Link = require("../models/Link");
const today = Date.now();
console.log(`[*] Worker.js: Ran scheduled task at ${today}`);
Link.deleteMany({ expirationDate: { $lte: today } })
  .then(function(){
    console.log('[+] Worker.js: Cleared old entries');
  })
  .catch(function(error){
    console.log('[-] Worker.js: Error running scheduled task:');
    console.log(error);
  });
