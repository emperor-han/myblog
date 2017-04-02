var mongoose = require('mongoose');
var studentSchema = require('../schemas/student.js');
var Student = mongoose.model('Student',studentSchema);

module.exports = Student;
