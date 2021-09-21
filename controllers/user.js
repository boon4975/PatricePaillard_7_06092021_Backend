const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const { password } = require('../config/env');
const User = db.user;

exports.signup2 = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      User.create({
          email: req.body.email,
          password: hash,
          moderator: 1
      })
      .then( (user) => {
          res.status(200).json({ 
              status: true,
          message: 'user créé'})
      })
      .catch(error => res.status(401).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.signup = (req, res) => {
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
        res.status(200).json(result[0].email + ' existe déjà');
      }
    })
  })
  .catch(error => res.status(401).json({ error }))
}