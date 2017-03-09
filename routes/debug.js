// routes/api.js
var config      = require('./../config');
var express     = require('express');
var router      = express.Router();
var jwt         = require('jsonwebtoken');
var User        = require('./../models/user');

// route to authenticate a user (POST http://localhost:3000/debug/setup)
router.get('/setup', function(req, res) {

    // create a sample user
    var admin = new User({
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