const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// connexion DB MySql
const db = require('./config/db.config');
db.sequelize.sync() //{ force: true }
.then( () => {
    console.log('creat if not exist');
});

require('./routes/user')(app);
require('./routes/post')(app);

module.exports = app;

//groupomania