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
var listener = require('./listeners/mqtt')(mqttClient);

/**
 * API
 */
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken');
var User   = require('./models/user');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000;
mongoose.connect(config.mongodb.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);