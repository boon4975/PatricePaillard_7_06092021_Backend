const { sequelize } = require('../config/db.config');
const db = require('../config/db.config');
const Post = db.post;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 * Création de Pix
 */
exports.createPix = (req, res, next) => {
    Post.create({
        title: req.body.title,
        message: req.body.message,
        user_id: req.body.user_id,
        url_image: req.body.formdata //a revoir pour ajout image
    })
    .then( (user) => {
        res.status(201).json(user)
    })
    .catch(error => res.status(401).json({ error }))
}

/**
 * Retourne tous les Pix
 */
 exports.getAllPix = (req, res, next) => {
    Post.findAll({
        order:[ ['updatedAt', 'DESC'] ],
        include: {all: true, nested: true},
        where: {url_image:
                    { [Op.ne]: null }
        }
    })
    .then((result)=>{
        res.status(200).json(result)
    })
};

/**
 * Ajout image à Pix spécifié
 */
exports.putPix = (req, res, next) => {
    let imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    Post.update(
        {url_image: imageUrl},
        {where: {id: req.body.id}}
    )
    .then((result)=> {
        res.status(200).json(result)
    })
    .catch((error)=> res.status(500).json({ error }))
}

