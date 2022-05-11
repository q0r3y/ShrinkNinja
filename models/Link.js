'use strict';
const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
  shortCode: {
    type: String,
    required: false,
  },
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: false
  },
  creationDate: {
    type: Date,
    required: false
  },
  expirationDate: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Links', LinkSchema);
