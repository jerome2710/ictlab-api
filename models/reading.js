"use strict";

// models/reading.js
const Influx = require('influx');

const schema = [
    {
        measurement: 'readings',
        fields: {
            uuid: Influx.FieldType.STRING,
            location: Influx.FieldType.STRING,
            type: Influx.FieldType.STRING,
            reading: Influx.FieldType.FLOAT,
            unit: Influx.FieldType.STRING,
            battery: Influx.FieldType.FLOAT
        },
        tags: [
            'uuid',
            'location',
            'type'
        ]
    }
];

// Export the model
module.exports = schema;