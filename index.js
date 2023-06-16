const express = require('express');
const app = express();
const { auth } = require('express-openid-connect');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yaml');
const path = require('path');

require('dotenv').config();

const port = process.env.PORT || 3000;

// Get user profile information
const { requiresAuth } = require('express-openid-connect');

// Serve static files
app.use(express.static('public'));

// Use the Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON
app.use(express.json());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// If authenticated, redirect to /main, otherwise redirect to /login
app.get('/main', requiresAuth(), (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'main.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
});

app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}`);
});
