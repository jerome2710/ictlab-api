// routes/sensors.js
var express     = require('express');
var router      = express.Router();
var Reading     = require('./../models/reading');

// route to return all latest readings (GET http://localhost:3000/sensors/list)
router.get('/list', function(req, res) {
    Reading.aggregate(
        [
            {$sort: {'timestamp': -1}},
            {
                $group: {
                    'uuid': '$uuid',
                    'battery': { '$first': '$battery' },
                    'location': { '$first': 'location' },
                    'timestamp': { '$first': '$timestamp' }
                }
            }
        ], function (err, sensors) {
        res.json({
            status: 'success',
            data: {
                sensors: sensors
            }
        })
    });
});

module.exports = router;