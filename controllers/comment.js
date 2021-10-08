const db = require('../config/db.config');
const env = require("../config/env");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Comment = db.comment;

exports.addComment = (req, res) => {
    Comment.create({
        post_id: req.body.post_id,
        user_id: req.body.user_id,
        message: req.body.message
    })
    .then( (comment) => {
        res.status(201).json(comment)
    })
    .catch(error => res.status(401).json({ error }))
}