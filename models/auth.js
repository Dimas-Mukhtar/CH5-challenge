"use strict"
const bcrypt = require("bcryptjs")

const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auth.belongsTo(models.User, {
        foreignKey: {
          name: "userId"
        }
      })
    }
  }
  Auth.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter Email, Email are required!"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter password, Password are required!"
          }
        }
      },
      confirmPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The database doesn't accept your credentials, Please enter confirmPassword, confirmPassword are required!"
          }
        }
      },
      userId: {
        type: DataTypes.UUID
      }
    },
    {
      hooks: {
        afterValidate: (auth, options) => {
          if (auth.email) {
            auth.email = auth.email.toLowerCase()
          }
        },
        beforeCreate: async (auth) => {
          if (auth.password && auth.confirmPassword) {
            const salt = await bcrypt.genSalt(10)
            auth.password = await bcrypt.hash(auth.password, salt)
            auth.confirmPassword = await bcrypt.hash(auth.password, salt)
          }
        }
      },
      sequelize,
      modelName: "Auth"
    }
  )
  Auth.prototype.comparePasswordToDB = async (reqPassword, DBPassword) => {
    return await bcrypt.compareSync(reqPassword, DBPassword)
  }
  return Auth
}
