const { sequelize } = require('../config/db.config');
const db = require('../config/db.config');
const Post = db.post;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 * Création de Post
 */
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

/**
 * Retourne tous les Posts
 */
exports.getAllPosts = (req, res, next) => {
    Post.findAll({
        order:[ ['updatedAt', 'DESC'] ],
        include: {all: true, nested: true},
        where: {url_image:
            { [Op.is]: null }
        }
    })
    .then((result)=>{
        res.status(200).json(result)
    })
};

/**
 * Retourne les 10 derniers Posts
 */
exports.getLastPosts = (req, res, next) => {
    Post.findAll({
        order:[ ['updatedAt', 'DESC'] ],
        include: {all: true, nested: true},
        limit: 5
    })
    .then((result)=>{
        res.status(200).json(result)
    })
};

/**
 * Retourne le post spécifié
 */
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

/**
 * Met à jour le Post spécifié
 */
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

/**
 * Supprime le post spécifié
 */
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