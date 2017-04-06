// routes/sensors.js
var express     = require('express');
var router      = express.Router();
var Reading     = require('./../models/reading');

// route to return all sensors with latest data (GET http://localhost:3000/sensors)
router.get('/', function(req, res) {
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
            res.json({
                status: 'success',
                data: {
                    sensors: data
                }
            })
        }
    );
});

// find sensor types & latest reading by uuid
router.get('/types', function(req, res) {
    Reading.aggregate(
        [
            { $match: { 'uuid': req.query.uuid } },
            {
                $group: {
                    '_id': '$type',
                    'reading': { '$last': '$reading' }
                }
            }
        ],
        function (err, data) {
            res.json({
                status: 'success',
                data: {
                    types: data
                }
            })
        }
    );
});

module.exports = router;