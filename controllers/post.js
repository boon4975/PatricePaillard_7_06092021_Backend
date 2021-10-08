const { sequelize } = require('../config/db.config');
const db = require('../config/db.config');
const Post = db.post;
const User = db.user;

exports.createPost = (req, res, next) => {
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
};

exports.getOnePost = (req, res, next) => {
    Post.findOne({
        where: {id: req.params.id}
    })
    .then((post) =>{
        if(post){
            res.status(200).json(post)
        }else{
            res.status(202).json('Post non trouvé')
        }
    })
    .catch((error) => res.status(500).json({ error }))
};

exports.updatePost = (req, res, next) => {
    Post.update(
        {title: req.body.title, message: req.body.message},
        {where: {id: req.body.postId}}
    )
    .then((post) => {
        res.status(201).json(post)
    })
    .catch((error) => res.status(500).json({ error }))
};

exports.delPost = (req, res, next) => {
    let idToDel = parseInt(req.params.id);
    if(Number.isInteger(idToDel)){
        Post.destroy(
        {where: {id: idToDel}}
        )
        .then((result) => {
        res.status(201).json(result)
        })
        .catch((error)=> res.status(500).json({ error }))
    }else{
        res.status(401).json('erreur de requête')
    }
}