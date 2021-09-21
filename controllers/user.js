const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const User = db.user;

exports.signup = (req, res) => {
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