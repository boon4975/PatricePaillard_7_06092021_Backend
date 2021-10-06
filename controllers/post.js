const { sequelize } = require('../config/db.config');
const db = require('../config/db.config');
const post = require('../models/post');
const Post = db.post;
const User = db.user

exports.createPost = (req, res) => {
    Post.create({
        title: req.body.title,
        message: req.body.message,
        user_id: req.body.user_id
    })
    .then( (user) => {
        res.status(201).json(user)
    })
    .catch(error => res.status(401).json({ error }))
}

exports.getAllPosts = (req, res, next) => {
    Post.findAll({
        order:[ ['updatedAt', 'DESC'] ],
        include: User
    })
    .then((result)=>{
        res.status(200).json(result)
    })
}