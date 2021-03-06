const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("../config/env");
const User = db.user;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs')
const Topic = db.topic;

const regexEmail = /^[a-z0-9][a-z0-9._-]+@[a-z0-9._-]{2,}\.([a-z]{2,4})$/;
const regexPass = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.:'!@#$%&*_+=|(){}[?\-\]\/\\])(?!.*[<>`])).{8,}/;
const regexPseudo = /(^[a-zA-Z0-9_-]).{3,}/;

/**
 * Création de compte
 * valide la saisie utilisateur via REGEX
 * vérifie l'unicité email et pseudo
 * HASH du mot de passe
 */
exports.signup = (req, res, next) => {
  let inputEmail = req.body.email;
  let inputPseudo = req.body.pseudo;
  let inputPwd = req.body.password;
  let validInput = [];
  validInput.push(inputEmail.match(regexEmail),inputPwd.match(regexPass),inputPseudo.match(regexPseudo));
  if(validInput[0] && validInput[1] && validInput[2] != null){
    User.findOne({
      where: { [Op.or]: [{email: inputEmail}, {pseudo: inputPseudo}] }
    })
    .then((result) => {
      if(result === null){
        bcrypt.hash(inputPwd, 10)
        .then((hash) => {
          User.create({
            pseudo: inputPseudo,
            email: inputEmail,
            password: hash,
            moderator: 0,
            url_image: 'http://192.168.1.21:3000/default_user.png'
          })
          .then((user) =>{
              res.status(201).json({
                user_id: user.id,
                email: user.email,
                pseudo: user.pseudo,
                moderator: user.moderator,
                url_image: user.url_image,
                token: jwt.sign(
                    { user_id: user.id},
                    `${env.token}`,
                    {expiresIn: '24h'}
                )
              })
            })
          .catch((error)=> res.status(500).json({ error }))
        })
        .catch((error)=> res.status(500).json({ error })) 
      }else if(result.pseudo.toLowerCase() == inputPseudo.toLowerCase()){
        res.status(202).json('Pseudo déjà utilisé');
      }else{
        res.status(202).json('Email déjà utilisé');
      }
    })
    .catch((error)=> res.status(500).json({ error }))
  }else if(validInput[0] == null) {
    res.status(202).json('Adresse email non valide')
  }else if(validInput[1] == null) {
    res.status(202).json('Le mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale')
  }else{
    res.status(202).json('Pseudo non valide')
  }
};

/**
 * connexion au compte
 * valide la saisie utilisateur via REGEX
 * vérifie email et mot de passe Hash
 */
exports.login = (req, res, next) => {
  let inputEmail = req.body.email;
  let inputPwd = req.body.password;
  let validInput = [];
  validInput.push(inputEmail.match(regexEmail),inputPwd.match(regexPass));
    if(validInput[0] && validInput[1] != null){
      User.findOne({
        where: { email: inputEmail}
      })
      .then((user) => {
        if(!user){
          return res.status(202).json('Utilisateur non trouvé');
        }
        bcrypt.compare(inputPwd, user.password)
        .then((valid) => {
          if(!valid){
            return res.status(202).json('Mot de passe incorrect');
          }
          res.status(201).json({
            user_id: user.id,
            email:user.email,
            pseudo: user.pseudo,
            moderator: user.moderator,
            url_image: user.url_image,
            token: jwt.sign(
                { user_id: user.id},
                `${env.token}`,
                {expiresIn: '24h'}
            )
          })
        }) 
        .catch((error)=> res.status(500).json({ error }))
      })
      .catch((error)=> res.status(500).json({ error }))
    
    }else if(validInput[0] == null) {
    res.status(202).json('Adresse email non valide')
    }else {
    res.status(202).json('Le mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale')
  }
};

/**
 * Changement de mot de passe de compte
 * valide la saisie utilisateur via REGEX
 * vérifie email et ancien mot de pas
 * HASH du nouveau mot de passe
 */
exports.changePwd = (req, res, next) => {
  let validInput = [];
  validInput.push(req.body.oldpassword.match(regexPass), req.body.newpassword.match(regexPass));

  if ( (validInput[0] && validInput[1]!= null) && (Number.isInteger(req.body.user_id)) ){
    User.findOne({
      where: { id: req.body.user_id }
    })
    .then((user) => {
      if(!user){
        return res.status(202).json('Utilisateur non trouvé');
      }
      bcrypt.compare(req.body.oldpassword, user.password)
      .then((valid)=>{
        if(!valid){
          return res.status(202).json('Ancien mot de passe incorrect');
        }
        bcrypt.hash(req.body.newpassword,10)
        .then((hash)=>{
          User.update({password: hash},
            {where: {id: req.body.user_id}}
            )
          .then((update)=>{
            res.status(201).json(update)
          })
          .catch((error) => res.status(401).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
  }else{
    res.status(202).json('Le Nouveau mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale');
  }
};

/**
 * Suppression de compte
 * Suppression de l'avatar si présent
 * Suppression des images des Topics du user
 */
exports.delAccount = (req, res, next) => {
  let idToDel = parseInt(req.params.id);
  User.findOne({ //retourne les url avatar et des topics du user
    where: {id:req.params.id},
    attributes: ['url_image'],
    include: {
      model: Topic,
      attributes: ['url_image']
    }
  })
  .then((user)=>{
    if(user.url_image){ // image avatar => suppression
      const filename = user.url_image.split('/images/')[1];
      fs.unlink(`assets/images/${filename}`, ()=>{
        console.log('suppression image avatar')
      })
    };
    // tableau des url des posts du User
    let tab = Object.values(user.topics);
    if(tab.length > 0){
      const filename = '';
      for(value of tab){ // boucle de suppression des images
        let url = new String(value.dataValues.url_image)
        let filename = url.split('/images/')[1]
        if(filename){
          fs.unlink(`assets/images/${filename}`, ()=>{
            console.log('suppression de ' + filename)
          })
        }
      };
    };
  //suppression du compte
    User.destroy({where:{id:idToDel}})
        .then(()=>{
          res.status(201).json('compte, images topic et avatar supprimés')
        })
        .catch((error)=> res.status(500).json({ error }))
  })
  .catch((error)=> res.status(401).json({ error }))
};

/**
 * Gestion du mode Modérateur
 * action GET => retourne les infos du compte spécifié
 * action PUT => change la valeur BOOLEEN du paramètre Moderator du compte
 */
exports.updateModerator = (req, res, next) =>{
  let receivedMail = req.body.email;
    if(receivedMail.match(regexEmail) != null){
      if(req.body.action == 'get'){
        User.findOne({
          where: {email: receivedMail}
        })
        .then((result)=>{
          if(result){
            res.status(200).json({
              email: result.email,
              pseudo: result.pseudo,
              moderator: result.moderator
            })
          }else{
            return res.status(202).json({message: 'Utilisateur introuvable'})
          }
        })
        .catch((error)=> res.status(500).json({ error }))
      }else if(req.body.action == 'put'){
        User.update(
          {moderator: req.body.moderator},
          {where: {email: receivedMail}}
        )
        .then(() => {
          res.status(200).json({
            moderator: req.body.moderator,
            pseudo: req.body.pseudo
          })
        })
        .catch((error) => res.status(500).json({ error }))
      }
    }else{
      return res.status(202).json({ message: 'format de mail incorrect'})
    }
};

/**
 * Upload de l'image Avatar
 * supprime l'ancien image du dossier assets/images
 */
exports.avatar = (req, res, next) => {
  User.findOne({where: {id:req.body.user_id}})
    .then((user)=>{
      if(user.url_image){
        const previous = user.url_image.split('/images/')[1];
        imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        fs.unlink(`assets/images/${previous}`, ()=>{
          User.update(
            {url_image: imageUrl},
            {where: {id: req.body.user_id}}
          )
          .then(()=> {
            res.status(201).json(imageUrl)
          })
          .catch((error)=> res.status(501).json({ error }))
          })
      }else{
        User.update(
            {url_image: imageUrl},
            {where: {id: req.body.user_id}}
          )
        .then(()=> {
          res.status(201).json(imageUrl)
        })
        .catch((error)=> res.status(501).json({ error }))
      };
    })
    .catch((error)=> res.status(400).json({ error })) 
};
