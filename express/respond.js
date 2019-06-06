'use strict';
const mongoose = require('mongoose');

const respondSchema = new mongoose.Schema({
  text: String,
  name: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
}, { timestamps: true });


module.exports = mongoose.model('Respond', respondSchema);
