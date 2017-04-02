var mongoose = require('mongoose');
var helpSchema = require('../schemas/help.js');
var Help = mongoose.model('Help',helpSchema);

module.exports = Help;
