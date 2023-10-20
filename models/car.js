"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.User, {
        foreignKey: {
          name: "userId"
        }
      })
    }
  }
  Car.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter car name, Name are required!"
          }
        }
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter car price, Car Price are required!"
          }
        }
      },
      category: {
        type: DataTypes.ENUM(["small", "medium", "large"]),
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter car category, Car Category are required!, choose one between small, medium, or large"
          }
        }
      },
      userId: {
        type: DataTypes.UUID
      }
    },
    {
      sequelize,
      modelName: "Car"
    }
  )
  return Car
}
