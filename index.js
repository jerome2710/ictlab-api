"use strict";

/**
 * Config file
 */
const config = require('./config');

/**
 * Requires
 */
const Influx        = require('influx');
const mqtt          = require('mqtt');
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const mongoose      = require('mongoose');

/**
 * Models
 */
const readingModel = require('./models/reading');

/**
 * Influx setup
 */
const influx = new Influx.InfluxDB({
    host:       config.influxdb.host,
    port:       config.influxdb.port,
    username:   config.influxdb.username,
    password:   config.influxdb.password,
    database:   config.influxdb.database,
    schema:     readingModel
});

/**
 * MQTT Listener
 */
const mqttClient = mqtt.connect(config.mqtt.host, {
    port:       config.mqtt.port,
    clientId:   'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username:   config.mqtt.username,
    password:   config.mqtt.password
});
require('./listeners/mqtt')(mqttClient, influx);


/**
 * API
 */
const debugRoutes     = require('./routes/debug');
const authRoutes      = require('./routes/authentication');
const sensorRoutes    = require('./routes/sensors')(influx);
const readingRoutes   = require('./routes/readings')(influx);

// ==============================================
// configuration ================================
// ==============================================
const port = process.env.PORT || 3000;
mongoose.connect(config.mongodb.database);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// ==============================================
// routes =======================================
// ==============================================

// DEBUG ROUTES -----------------
app.use('/debug', debugRoutes);

// API ROUTES -------------------
app.use('/', authRoutes);

// SENSOR ROUTES ----------------
app.use('/sensors', sensorRoutes);

// READING ROUTES ---------------
app.use('/readings', readingRoutes);

// 404 ROUTE -------------------
app.all('*', function(req, res) {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// ==============================================
// start the server =============================
// ==============================================
app.listen(port);
console.log('API started listening');