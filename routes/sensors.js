"use strict";

// routes/sensors.js
const express     = require('express');
const router      = express.Router();

module.exports = function(influx) {

    /**
     * Route to return all sensors with latest data (GET http://localhost:3000/sensors)
     */
    router.get('/', function(req, res) {
        influx.query('SELECT * FROM readings GROUP BY uuid ORDER BY time DESC').then(result => {

            let groups = result.groups();
            let sensors = [];
            for (let i = 0; i < groups.length; i++) {
                sensors.push({
                    uuid: groups[i].tags.uuid,
                    battery: groups[i].rows[0].battery,
                    location: groups[i].rows[0].location,
                    timestamp: groups[i].rows[0].time.valueOf(),
                });
            }

            res.json({
                status: 'success',
                data: {
                    sensors: sensors
                }
            });
        }).catch(err => {
            res.status(500).send({
                status: 'error',
                message: err.stack
            });
        });
    });

    /**
     * Find sensor types & latest reading by uuid (GET http://localhost:3000/sensors/types?uuid={uuid})
     */
    router.get('/types', function(req, res) {
        influx.query("SELECT * FROM readings WHERE uuid = '" + req.query.uuid + "' GROUP BY type ORDER BY time DESC").then(result => {

            let groups = result.groups();
            let types = [];
            for (let i = 0; i < groups.length; i++) {
                types.push({
                    type: groups[i].tags.type,
                    reading: groups[i].rows[0].reading,
                });
            }

            res.json({
                status: 'success',
                data: {
                    types: types
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