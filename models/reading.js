// models/reading.js
var mongoose = require('mongoose');

var ReadingSchema = mongoose.Schema({
    uuid: String,
    location: String,
    type: String,
    reading: Number,
    unit: String,
    timestamp: Number,
    battery: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Reading', ReadingSchema);