const { sequelize } = require('../config/db.config');
const db = require('../config/db.config');
const Topic = db.topic;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs');

/**
 * Retourne les 10 derniers Topics
 */
 exports.getLastTopic = (req, res, next) => {
    Topic.findAll({
        order:[ ['updatedAt', 'DESC'] ],
        include: {all: true, nested: true},
        limit: 5
    })
    .then((result)=>{
        res.status(200).json(result)
    })
};
/**
 * Retourne tous les Posts
 */
exports.getAllPost = (req, res, next) => {
    Topic.findAll({
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
 * Retourne tous les Pix
 */
 exports.getAllPix = (req, res, next) => {
    Topic.findAll({
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
 * Retourne le topic spécifié
 */
exports.getOneTopic = (req, res, next) => {
    Topic.findOne({
        where: {id: req.params.id}
    })
    .then((post) =>{
        if(post){
            res.status(200).json(post)
        }else{
            res.status(202).json('Topic non trouvé')
        }
    })
    .catch((error) => res.status(500).json({ error }))
};
/**
 * 
 */
exports.createTopic = (req, res, next) => {
    if(!req.file){
        Topic.create({
            title: req.body.title,
            message: req.body.message,
            user_id: req.body.user_id
        })
        .then( (user) => {
            res.status(201).json(user)
        })
        .catch(error => res.status(401).json({ error }))
    }else{
        let imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        Topic.create({
            title: req.body.title,
            message: req.body.message,
            user_id: req.body.user_id,
            url_image: imageUrl
        })
        .then((result)=> {
            res.status(201).json(result)
        })
        .catch((error)=> res.status(500).json({ error }))
        }
};
/**
 * Update Topic
 */
exports.updateTopic = (req, res, next) => {
    let imageUrl = req.body.urlimage;
    if(!req.file){
        Topic.update(
            {title: req.body.title, message: req.body.message},
            {where: {id: req.body.postId}}
        )
        .then((post) => {
            res.status(201).json(post)
        })
        .catch((error) => res.status(500).json({ error }))
    }else{
        Topic.findOne({where:{id:req.body.postId}})
        .then((topic)=>{
            const filename = topic.url_image.split('/images/')[1];
            imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            fs.unlink(`assets/images/${filename}`, ()=>{
                Topic.update(
                    {title: req.body.title, message: req.body.message,url_image: imageUrl},
                    {where: {id: req.body.postId}}
                )
                .then((result)=> {
                    res.status(201).json(result)
                })
                .catch((error)=> res.status(500).json({ error }))
            })
        })
        .catch((error) => res.status(500).json({ error }))
    }
};
    
            
/**
 * Supprime le Topic spécifié
 */
exports.delTopic = (req, res, next) => {
    let idToDel = parseInt(req.params.id);
    if(Number.isInteger(idToDel)){
        Topic.destroy(
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