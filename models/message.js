var mongoose = require('mongoose');
var messageSchema = require('../schemas/message.js');
var Message = mongoose.model('Message',messageSchema);

module.exports = Message;
