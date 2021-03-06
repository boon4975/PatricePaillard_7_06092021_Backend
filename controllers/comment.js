const db = require('../config/db.config');
const Sequelize = require("sequelize");
const Comment = db.comment;
const Topic = db.topic;



/**
 * Ajoute un commentaire
 */
exports.addComment = (req, res, next) => {
    Comment.create({
        topic_id: req.body.topic_id,
        user_id: req.body.user_id,
        message: req.body.message
    })
    .then( (comment) => {
        let updateComment = new Date()
        Topic.update(
            {last_update: updateComment },
            {where: {id:req.body.topic_id}}
        )
        .then(()=>{
            res.status(201).json(comment)
        })
        .catch(error => res.status(401).json({ error }))
        
    })
    .catch(error => res.status(401).json({ error }))
};

/**
 * Met à jour un commentaire
 */
exports.updateComment = (req, res, next) => {
    Comment.update(
        {message: req.body.message},
        {where: {id: req.body.comment_id}}
    )
    .then((comment)=>{
        let updateComment = new Date()
        Topic.update(
            {last_update: updateComment },
            {where: {id:req.body.topic_id}}
        )
        .then(()=>{
            res.status(201).json(comment)
        })
        .catch(error => res.status(401).json({ error }))
    })
    .catch((error)=> res.status(500).json({ error }))
}

/**
 * Retourne le commentaire spécifié
 */
exports.getComment = (req, res, next) => {
    Comment.findOne({
        where: {id: req.params.id}
    })
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((error)=> res.status(500).json({ error }))
}

/**
 * Supprime le commentaire spécifié
 */
exports.delComment = (req, res, next) => {
    let idToDel = parseInt(req.params.id);
    if(Number.isInteger(idToDel)){
        Comment.destroy(
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