// listeners/mqtt.js
var Reading = require('./../models/reading');

module.exports = function(client) {

    // when connected - listen to the sensors
    client.on('connect', function() {
        client.subscribe('sensors');
    });

    // process reading
    client.on('message', function (topic, message) {

        message = JSON.parse(message);

        for (var index = 0; index < message.readings.length; ++index) {
            var reading = new Reading({
                uuid: message.uuid,
                location: message.location,
                type: message.readings[index].type,
                reading: message.readings[index].reading,
                unit: message.readings[index].unit,
                timestamp: message.readings[index].timestamp,
                battery: message.battery
            });
            reading.save(function (err) {
                if (err) throw err;
            });
        }

        console.log('Readings saved');
    });
};