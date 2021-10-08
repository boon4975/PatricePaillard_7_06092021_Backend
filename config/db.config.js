const env = require("./env.js");

const Sequelize = require("sequelize");

const sequelizeCnx = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true
  },
  timezone: '+02:00'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelizeCnx;

//Models
db.user = require('../models/user') (sequelizeCnx, Sequelize);
db.post = require('../models/post') (sequelizeCnx, Sequelize);
db.comment = require('../models/comment') (sequelizeCnx, Sequelize);

module.exports = db;