const db = require('../config/db.config');
const Post = db.post;

exports.createPost = (req, res) => {
    Post.create({
        title: req.body.title,
        message: req.body.message,
        userId: req.body.userId
    })
    .then( (user) => {
        res.status(200).json({ 
            status: true,
        message: 'post créé'})
    })
    .catch(error => res.status(401).json({ error }))
}