"use strict"

const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Auth, {
        foreignKey: {
          name: "userId"
        }
      })

      User.hasMany(models.Car, {
        foreignKey: {
          name: "userId"
        }
      })
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter name, Name are required!"
          },
          notEmpty: {
            msg: "The database doesn't accept your credentials, Cannot accept empty string for name"
          }
        }
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter age, Age are required!"
          }
        }
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter address, Address are required!"
          },
          notEmpty: {
            msg: "The database doesn't accept your credentials, Cannot accept empty string for address"
          }
        }
      },
      role: {
        type: DataTypes.ENUM(["superadmin", "admin", "member"]),
        defaultValue: "member"
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  )
  return User
}
