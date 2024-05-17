const express = require('express');
const { Module } = require('module');
const router = express.Router();
const path = require('path');


router.get('/script', (req, res) => {
  res.sendFile(path.join(__dirname, '/js/script.js'));// this gets executed when user visit http://localhost:3000/user
});

router.get('/jQuery', (req, res) => {
    res.sendFile(path.join(__dirname, '/js/jQuery.js'));// this gets executed when user visit http://localhost:3000/user
});

router.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, '/css/style.css'));// this gets executed when user visit http://localhost:3000/user
});


module.exports = router;