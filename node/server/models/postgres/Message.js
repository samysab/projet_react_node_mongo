const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Message extends Model {
}

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
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        from: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isWarning: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize,
        modelName: "message",
    }
);

module.exports = Message;
