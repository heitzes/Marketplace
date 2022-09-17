const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                userID: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    primaryKey: true,
                    autoIncrement: true,
                },
                address: {
                    type: Sequelize.STRING(150),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "User",
                tableName: "user",
                paranoid: false,
                charset: "utf8",
            }
        );
    }
    static associate(db) {}
};
