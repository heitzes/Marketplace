const Sequelize = require("sequelize");
const { Address } = require(".");

module.exports = class Info extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tokenID: {
          type: Sequelize.INTEGER,
          allowNull: true,
          primaryKey: true,
          autoIncrement: true,
        },
        minted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        // tx_err: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false,
        // },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        tokenURI: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        owner: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        seller: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        signature: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "NFT",
        tableName: "nft",
        paranoid: false,
        charset: "utf8",
      }
    );
  }
  static associate(db) {}
};
