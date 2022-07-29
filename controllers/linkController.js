'use strict';
const db = require('../models/database');

async function handleOptions(link) {
  if (link['singleUse'] === true) {
    await db.eraseLink(link['shortCode']);
  }
}

module.exports = {handleOptions}
