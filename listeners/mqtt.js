"use strict";

// listeners/mqtt.js
module.exports = function(client, influx) {

    // when connected - listen to the sensors
    client.on('connect', function() {
        client.subscribe('sensors');
    });

    // process reading
    client.on('message', function (topic, message) {

        message = JSON.parse(message);

        for (let index = 0; index < message.readings.length; ++index) {

            influx.writePoints([
                {
                    measurement: 'readings',
                    tags: {
                        'uuid': message.uuid,
                        'location': message.location,
                        'type': message.readings[index].type
                    },
                    fields: {
                        reading: message.readings[index].reading,
                        unit: message.readings[index].unit,
                        battery: message.battery
                    },
                    timestamp: new Date(message.readings[index].timestamp * 1000)
                }
            ]).catch(err => {
                console.error(`Error saving data to InfluxDB! ${err.stack}`)
            });
        }

        console.log('Readings saved');
    });
};