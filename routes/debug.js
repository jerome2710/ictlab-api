"use strict";

// routes/api.js
const config      = require('./../config');
const express     = require('express');
const router      = express.Router();
const jwt         = require('jsonwebtoken');
const User        = require('./../models/user');

// route to authenticate a user (POST http://localhost:3000/debug/setup)
router.get('/setup', function(req, res) {

    // create a sample user
    let admin = new User({
        username: 'admin',
        password: 'admin',
        admin: true
    });

    // save the sample user
    admin.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
            success: 'success',
            data: {}
        });
    });
});

module.exports = router;