// routes/users.js
const express = require('express');
const router = express.Router();
const path = require('path');


// Define a route
router.get('/regions', (req, res) => {
    res.sendFile(path.join(__dirname, '/regions.html'));// this gets executed when user visit http://localhost:3000/user
});

router.get('/stations', (req, res) => {
    res.sendFile(path.join(__dirname, '/stations.html'));
});

router.get('/overview', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// export the router module so that server.js file can use it
module.exports = router;