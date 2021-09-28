const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("../config/env");
const User = db.user;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const regexEmail = /^[a-z0-9][a-z0-9._-]+@[a-z0-9._-]{2,}\.([a-z]{2,4})$/;
const regexPass = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.:'!@#$%&*_+=|(){}[?\-\]\/\\])(?!.*[<>`])).{8,}/;
const regexPseudo = /(^[a-zA-Z0-9_-]).{3,}/;

exports.signup = (req, res, next) => {
  let inputEmail = req.body.email;
  let inputPseudo = req.body.pseudo.toLowerCase();
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
            moderator: 0
          })
          .then( (resp) =>{
            res.status(201).json(resp);
            })
          .catch((error)=> res.status(500).json({ error }))
        })
        .catch((error)=> res.status(500).json({ error })) 
      }else if(result.pseudo === inputPseudo){
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
            userId: user.id,
            pseudo: user.pseudo,
            token: jwt.sign(
                { userId: user.id},
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
/*
exports.profil = (req, res, next) => {
  let data = [];
  data.push(req.body.userId, req.body.oldpassword, req.body.newpassword);
  User.update(
    {password: req.body.newpassword},
    {where: {id: req.body.userId}}
  )
  .then((update)=> {
    res.status(200).json(update)
  })
  .catch((e)=> res.status(401).json({ e }))
}
*/

exports.profil = (req, res, next) => {
  let validInput = [];
  validInput.push(req.body.oldpassword.match(regexPass), req.body.newpassword.match(regexPass));

  if ( (validInput[0] && validInput[1]!= null) && (Number.isInteger(req.body.userId)) ){
    User.findOne({
      where: { id: req.body.userId }
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
            {where: {id: req.body.userId}}
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
}
