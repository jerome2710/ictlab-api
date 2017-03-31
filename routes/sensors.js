// routes/sensors.js
var express     = require('express');
var router      = express.Router();
var Reading     = require('./../models/reading');

// route to return all sensors with latest data (GET http://localhost:3000/sensors)
router.get('/', function(req, res) {
    var sensors = null;

    Reading.aggregate(
        [
            {$sort: {'timestamp': -1}},
            {
                $group: {
                    '_id': '$uuid',
                    'battery': { '$first': '$battery' },
                    'location': { '$first': '$location' },
                    'timestamp': { '$first': '$timestamp' }
                }
            }
        ],
        function (err, data) {
            sensors = data;
        }
    );

    sensors = sensors.toObject();

    sensors.forEach(function(sensor) {
        Reading.aggregate([
            {$match: {'uuid': sensor.uuid}},
            {$group: {'_id': '$type'}}
        ], function (err, data) {
            sensor.types = data;
        });
    });

    res.json({
        status: 'success',
        data: {
            sensors: data
        }
    })
});

module.exports = router;