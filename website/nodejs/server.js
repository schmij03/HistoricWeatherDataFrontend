const http = require('http');
const express = require('express');
const app = express();

// Include route files
const usersRoute = require('./routes/routes');
const assetsRoute = require('./assets/assets');
const backendRoutes = require('./backend/backend');

// Use routes
app.use('/', usersRoute);
app.use('/assets', assetsRoute);
app.use('/backend', backendRoutes);
// Specify the port to listen on
const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});

