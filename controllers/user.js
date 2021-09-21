const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const User = db.user;

const regexEmail = /^[a-z0-9][a-z0-9._-]+@[a-z0-9._-]{2,}\.([a-z]{2,4})$/;
const regexPass = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.:'!@#$%&*_+=|(){}[?\-\]\/\\])(?!.*[<>`])).{8,}/;

exports.signup = (req, res) => {
  let inputEmail = req.body.email;
  if(inputEmail.match(regexEmail)){
    if(req.body.password.match(regexPass)){
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        User.findOrCreate({
          where: { email: req.body.email },
          defaults: {
            email: req.body.email,
            password: hash,
            moderator: 1
          }
        })
        .then(result => {
          if(result[1]){
            res.status(201).json(result);
          }else{
            res.status(200).json(result[0].email + ' est déjà utilisé');
          }
        })
      })
      .catch(error => res.status(401).json({ error }))
    }else{
      return res.status(401).json({ message: 'Le mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale '})
  }
  }else{
    return res.status(401).json({ message: 'Adresse email non valide'});
  }
}