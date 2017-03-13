// routes/sensors.js
var express     = require('express');
var router      = express.Router();
var Reading     = require('./../models/reading');

// route to return all latest readings (GET http://localhost:3000/readings)
router.get('/', function(req, res) {
    res.json({
        status: 'work-in-progress',
        data: {}
    });
});

// route to return readings for specific sensor (GET http://localhost:3000/readings/:uuid)
router.get('/:uuid', function(req, res) {

    // filter values
    var timestampFrom = parseInt((req.query.timestampFrom || Date.now()) || 0);
    var timestampTo = parseInt((req.query.timestampTo || Date.now()) || 0);
    var type = req.query.type || null;
    var location = req.query.location || null;

    // build filter
    var filter = [
        { 'uuid': req.params.uuid },
        { 'timestamp': { $gte: timestampFrom, $lte: timestampTo } }
    ];

    // add optionals
    if (type) {
        filter.push({ 'type': type });
    }

    if (location) {
        filter.push({ 'location': location });
    }

    // build query & return results
    Reading.find(
        { $and : filter },
        function (err, data) {
            res.json({
                status: 'success',
                data: {
                    filters: {
                        timestampFrom: timestampFrom,
                        timestampTo: timestampTo
                    },
                    readings: (data || [])
                }
            });
        }
    ).sort({ 'timestamp': 1 });
});

module.exports = router;