const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();
const db =
  {
    "host": process.env.DB_HOST,
    "name": process.env.DB_NAME,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS
  };

//connexion DB SQL
const sequelize = new Sequelize(db.name, db.username, db.password, {
  dialect: 'mysql',
  host: db.host
});
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
};

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json())

module.exports = app;