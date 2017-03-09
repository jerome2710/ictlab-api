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

var apiRoutes   = require('./routes/api');

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
app.get('/', function(req, res) {
    res.json({
        success: 'success',
        data: {}
    })
});

// app.get('/setup', function(req, res) {
//
//     // create a sample user
//     var admin = new User({
//         name: 'admin',
//         password: 'admin',
//         admin: true
//     });
//
//     // save the sample user
//     admin.save(function(err) {
//         if (err) throw err;
//
//         console.log('User saved successfully');
//         res.json({
//             success: 'success',
//             data: {}
//         });
//     });
// });


// API ROUTES -------------------
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('API started listening');