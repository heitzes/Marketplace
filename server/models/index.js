const Sequelize = require("sequelize");
const config = require("../config/config.json").development;

const User = require("./user");
const Info = require("./info");

//const Signature = require("./signature");

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.User = User;
db.Info = Info;

User.init(sequelize);
Info.init(sequelize);
User.associate(db);
Info.associate(db);
module.exports = db;
