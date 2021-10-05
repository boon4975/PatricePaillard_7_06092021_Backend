const express = require('express');
const jwt = require('jsonwebtoken');
const env = require("../config/env");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decodedToken = jwt.verify(token, `${env.token}`);
        console.log(decodedToken.user_id);
        const user_id = decodedToken.user_id;
        if (req.body.user_id && req.body.user_id !== user_id) {
            throw 'User ID incorrect'
        }else{
            next();
        }
    } catch ( error ) {
        res.status(401).json({ error: 'Requête non authentifiée' })
    }
};