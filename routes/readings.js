// routes/sensors.js
var express     = require('express');
var router      = express.Router();
var Reading     = require('./../models/reading');

// route to return all latest readings (GET http://localhost:3000/readings)
router.get('/', function(req, res) {
    // Reading.aggregate(
    //     [
    //         {$sort: {'timestamp': -1}},
    //         {
    //             $group: {
    //                 '_id': '$uuid',
    //                 'battery': { '$first': '$battery' },
    //                 'location': { '$first': '$location' },
    //                 'timestamp': { '$first': '$timestamp' }
    //             }
    //         }
    //     ], function (err, sensors) {
    //         res.json({
    //             status: 'success',
    //             data: {
    //                 sensors: sensors
    //             }
    //         })
    //     });
    res.json({
        status: 'work-in-progress',
        data: {}
    });
});

// route to return readings for specific sensor (GET http://localhost:3000/readings/:uuid)
router.get('/:uuid', function(req, res) {
    Reading.find(
        { 'uuid': req.params.uuid }
    );
});

module.exports = router;