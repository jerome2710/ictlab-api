"use strict";

// routes/sensors.js
const express     = require('express');
const router      = express.Router();

module.exports = function(influx) {

    /**
     * Route to return readings by the given params (GET http://localhost:3000/readings)
     */
    router.get('/', function(req, res) {

        let dateFrom = new Date(req.query.dateFrom * 1000).toISOString(),
            dateTo = new Date(req.query.dateTo * 1000).toISOString(),
            interval = req.query.interval,
            uuid = req.query.uuid,
            type = req.query.type;

        switch (interval) {
            case 'weekly':
                interval = '7d';
                break;
            case 'daily':
                interval = '1d';
                break;
            case 'hourly':
                interval = '1h';
                break;
            default:
                interval = '1d';
        }

        let query = "SELECT MEAN(reading) FROM readings WHERE " +
            "uuid = '" + uuid + "' AND " +
            "type = '" + type + "' AND " +
            "time >= '" + dateFrom + "' AND " +
            "time <= '" + dateTo + "' " +
            "GROUP BY time(" + interval + ")";

        influx.query(query).then(result => {
            res.json({
                status: 'success',
                data: {
                    readings: result
                }
            });
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                message: err.stack
            });
        });
    });

    return router;
};