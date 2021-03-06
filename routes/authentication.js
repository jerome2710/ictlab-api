"use strict";

// routes/api.js
const config      = require('./../config');
const express     = require('express');
const router      = express.Router();
const jwt         = require('jsonwebtoken');
const User        = require('./../models/user');

// route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user || (user.password !== req.body.password)) {
            res.status(403).json({
                status: 'error',
                message: 'Authentication failed; invalid credentials.'
            });
        } else if (user) {

            // create a token
            let token = jwt.sign(user, config.secret, {
                expiresIn: 3600 // expires in a hour
            });

            res.json({
                status: 'success',
                data: {
                    token: token
                }
            });
        }
    });
});

// route middleware to verify a token
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Authentication failed; token verification failed.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).json({
            status: 'error',
            message: 'Authentication failed; no token provided.'
        });
    }
});

// route to show a random message (GET http://localhost:3000/api/)
router.get('/', function(req, res) {
    res.json({
        status: 'success',
        data: {}
    });
});

module.exports = router;