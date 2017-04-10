"use strict";

// routes/sensors.js
const express     = require('express');
const router      = express.Router();
const Reading     = require('./../models/reading');

module.exports = function(influx) {

    /**
     * Route to return all latest readings (GET http://localhost:3000/readings)
     */
    router.get('/', function(req, res) {
        res.json({
            status: 'work-in-progress',
            data: {}
        });
    });

    /**
     * Route to return readings for specific sensor (GET http://localhost:3000/readings/:uuid)
     */
    router.get('/:uuid', function(req, res) {

        // filter values
        let timestampFrom = parseInt((req.query.timestampFrom || Date.now()) || 0);
        let timestampTo = parseInt((req.query.timestampTo || Date.now()) || 0);
        let type = req.query.type || null;
        let location = req.query.location || null;

        // build filter
        let filter = [
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


    return router;
};