'use strict';
const db = require('../models/database');

async function triggered(link) {
  if (link['singleUse'] === true) {
    await db.eraseLink(link['shortCode']);
  }
}

module.exports = { triggered };
