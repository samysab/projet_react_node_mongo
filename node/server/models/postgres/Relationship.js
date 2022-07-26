const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const { User } = require("./User");

class Relationship extends Model {}

Relationship.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        follower: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, 
                key: 'id'
              }
        },
        following: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, 
                key: 'id'
            }
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
     
    },
    {
      sequelize,
      modelName: "relationship",
    }
);


module.exports = Relationship;