const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require("../config/env");
const User = db.user;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const regexEmail = /^[a-z0-9][a-z0-9._-]+@[a-z0-9._-]{2,}\.([a-z]{2,4})$/;
const regexPass = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.:'!@#$%&*_+=|(){}[?\-\]\/\\])(?!.*[<>`])).{8,}/;

exports.signup = (req, res, next) => {
  let inputEmail = req.body.email;
  if(inputEmail.match(regexEmail)){
    if(req.body.password.match(regexPass)){
      User.findOne({
        where: { [Op.or]: [{email: inputEmail}, {pseudo: req.body.pseudo}] }
      })
      .then((result) => {
        if(result === null){
          bcrypt.hash(req.body.password, 10)
          .then((hash) => {
            User.create({
              pseudo: req.body.pseudo,
              email: req.body.email,
              password: hash,
              moderator: 0
            })
            .then( (resp) =>{
              res.status(201).json(resp);
              })
            .catch((error)=> res.status(500).json({ error }))
          })
          .catch((error)=> res.status(500).json({ error })) 
        }else if(result.pseudo === req.body.pseudo){
          res.status(202).json('Pseudo déjà utilisé');
        }else{
          res.status(202).json('Email déjà utilisé');
        }
      })
      .catch((error)=> res.status(500).json({ error }))
    }else{
      return res.status(200).json({ message: 'Le mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale '})
    }
  }else{
    return res.status(200).json({ message: 'Adresse email non valide'});
  }
};

exports.login = (req, res, next) => {
  let inputEmail = req.body.email;
  let inputPwd = req.body.password;
  if(inputEmail.match(regexEmail)){
    User.findOne({
      where: { [Op.or]: [{email: inputEmail}, {pseudo: req.body.pseudo}] }
    })
    .then(result => {
      res.status(200).json(result)
    })//then de result
    .catch(error => res.status(400).json({ message: 'grosse erreur' })) //catch du result
  }else{
    return res.status(401).json({ message: 'Adresse email non valide'});
  }
}


/*
exports.login = (req, res, next) => {
  let inputEmail = req.body.email;
  let inputPwd = req.body.password;
  if(inputEmail.match(regexEmail)){
    User.findOne({
      where: {email: inputEmail}
    })
    .then(result => {
      if(result === null){
        return res.status(401).json({ result });
      }
      bcrypt.compare(inputPwd, result.password)
        .then(valid => {
          if(!valid){
            return res.status(200).json('Mot de passe incorrect')
          }
          res.status(200).json({
            userId: result.id,
            token: jwt.sign(
                { userId: result.id},
                `${env.token}`,
                {expiresIn: '24h'}
            )
        });
        })
        .catch(error => res.status(401).json({ message: 'erreur then valid' }))
    })//then de result
    .catch(error => res.status(400).json({ message: 'grosse erreur' })) //catch du result
  }else{
    return res.status(401).json({ message: 'Adresse email non valide'});
  }
}
*/
