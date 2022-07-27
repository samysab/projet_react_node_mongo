const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");

class Report extends Model {}

Report.init(
    {
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "report",
    }
);


module.exports = Report;

