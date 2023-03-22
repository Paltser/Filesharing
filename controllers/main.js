// Once a user is logged in, the user gets redirected to the main view where they have full access to the application.
     res.send(JSON.stringify(req.oidc.user)); {
};

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
});

