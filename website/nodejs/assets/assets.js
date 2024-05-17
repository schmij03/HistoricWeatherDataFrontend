const express = require('express');
const { Module } = require('module');
const router = express.Router();
const path = require('path');

const sendFileSafe = (res, filePath) => {
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Failed to send file: ${filePath}`, err);
            res.status(500).send('Internal Server Error');
        }
    });
};

router.get('/script', (req, res) => {
    sendFileSafe(res, path.join(__dirname, '/js/script.js'));
});

router.get('/jQuery', (req, res) => {
    sendFileSafe(res, path.join(__dirname, '/js/jQuery.js'));
});

router.get('/css', (req, res) => {
    sendFileSafe(res, path.join(__dirname, '/css/style.css'));
});

module.exports = router;