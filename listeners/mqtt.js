// listeners/mqtt.js
var Reading = require('./../models/reading');

module.exports = function(client) {

    // when connected - listen to the sensors
    client.on('connect', function() {
        client.subscribe('sensors');
    });

    // process reading
    client.on('message', function (topic, message) {

        var reading = new Reading();

        console.log(message.toString());
    });
};