const express = require('express')

const isAuthenticated = ((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});

module.exports = isAuthenticated