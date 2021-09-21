const env = require("./env.js");

const Sequelize = require("sequelize");

const sequelizeCnx = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelizeCnx;

//Models
db.user = require('../models/user') (sequelizeCnx, Sequelize);
db.post = require('../models/post') (sequelizeCnx, Sequelize);

module.exports = db;