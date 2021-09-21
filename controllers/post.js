const db = require('../config/db.config');
const Post = db.post;

exports.post = (req, res) => {
    Post.create({
        titre: req.body.titre,
        message: req.body.message,
    })
    .then( (user) => {
        res.status(200).json({ 
            status: true,
        message: 'post créé'})
    })
    .catch(error => res.status(401).json({ error }))
}