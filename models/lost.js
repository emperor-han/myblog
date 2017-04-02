var mongoose = require('mongoose');
var lostSchema = require('../schemas/lost.js');
var Lost = mongoose.model('Lost',lostSchema);

module.exports = Lost;
