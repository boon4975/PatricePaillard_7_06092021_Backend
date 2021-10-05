const db = require('../config/db.config');
const Post = db.post;
const User = db.user

exports.createPost = (req, res) => {
    Post.create({
        title: req.body.title,
        message: req.body.message,
        user_id: req.body.user_id
    })
    .then( (user) => {
        res.status(200).json({ 
            status: true,
        message: 'post créé'})
    })
    .catch(error => res.status(401).json({ error }))
}

exports.getAllPosts = (req, res, next) => {
    Post.findAll({include: User})
    .then((result)=>{
        res.status(200).json(result)
    })
}