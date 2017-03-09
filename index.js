/**
 * MQTT Listener
 */
var config = require('./config');
var mqtt = require('mqtt');
var clientOptions = {
    port: config.mqtt.port,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: config.mqtt.username,
    password: config.mqtt.password
};
var mqttClient = mqtt.connect('wss://mqtt.chibb-box.nl', clientOptions);
require('./listeners/mqtt')(mqttClient);

/**
 * API
 */
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var authRoutes   = require('./routes/authentication');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000;
mongoose.connect(config.mongodb.database); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================

// API ROUTES -------------------
app.use('/', authRoutes);

// 404 ROUTE -------------------
app.all('*', function(req, res) {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('API started listening');