// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Import express-session
const crypto = require('crypto');
const axion = require('axios');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set up session middleware
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

// In app.js or index.js
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Error handling for file upload errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
        return res.status(500).json({ error: 'Server error: ' + err.message });
    }
    next();
});

// console.log('Session secret key:', secretKey);

// Import routes
const index = require('./routes/index');
// const ensureAuthenticated = require('./routes/auth');

// Use routes
app.use('/', index);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
