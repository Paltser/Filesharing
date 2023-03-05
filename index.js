const express = require('express');
const app = express();
const { auth } = require('express-openid-connect');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yaml');

require('dotenv').config();

const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Use the Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON
app.use(express.json());

// Handle sign-up form submission
/* app.post('/users', (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    if (!email || !password || !passwordConfirmation) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== passwordConfirmation) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Code to create a new user with the provided email and password would go here

    res.status(200).json({ message: 'User created successfully' });
});
*/

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Get user profile information
const { requiresAuth } = require('express-openid-connect');

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
