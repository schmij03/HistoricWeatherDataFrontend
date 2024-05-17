const express = require('express');
const app = express();

// Include route files
const usersRoute = require('./routes/routes');
const assetsRoute = require('./assets/assets');
const backendRoutes = require('./backend/backend');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', usersRoute);
app.use('/assets', assetsRoute);
app.use('/backend', backendRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Specify the port to listen on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});
