const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());
// accès pour affichage des images
app.use(express.static('assets'))

// connexion DB MySql
const db = require('./config/db.config');

//relation des tables
const User = db.user;
const Topic = db.topic;
const Comment = db.comment;
User.hasMany(Topic, {onDelete: 'cascade'});
Topic.belongsTo(User)

Topic.hasMany(Comment, {onDelete: 'cascade'})
Comment.belongsTo(Topic)

User.hasMany(Comment, {onDelete: 'cascade'})
Comment.belongsTo(User)

//synchro & création des tables
db.sequelize.sync() //{ force: true }
.then( () => {
    console.log('creat if not exist');
});

//routes API
require('./routes/user')(app);
require('./routes/topic')(app);
require('./routes/comment')(app);

module.exports = app;
