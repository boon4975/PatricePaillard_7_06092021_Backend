const express = require('express');
const jwt = require('jsonwebtoken');
const env = require("../config/env");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decodedToken = jwt.verify(token, `${env.token}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID incorrect'
        }else{
            next();
        }
    } catch ( error ) {
        res.status(401).json({ error: 'Requête non authentifiée' })
    }
};