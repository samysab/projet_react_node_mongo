const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");


class Relationship extends Model {}

Relationship.init(
    {
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
        }
     
    },
    {
      sequelize,
      modelName: "relationship",
    }
);


module.exports = Relationship;