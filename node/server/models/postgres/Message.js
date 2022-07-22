const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Message extends Model {}

Message.init(
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "message",
  }
);

module.exports = Message;
