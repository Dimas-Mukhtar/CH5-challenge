const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { User, Auth } = require("../models")
const ApiError = require("../utils/apiError")
const getTokenFromHeaders = require("../middlewares/getTokenFromHeaders")
const payloadUser = require("../middlewares/payloadUser")

// register for member only
exports.register = async (req, res, next) => {
  const { name, age, address, role, email, password, confirmPassword } = req.body
  try {
    const auth = await Auth.findOne({ where: { email } })
    if (auth) {
      return next(new ApiError("Email already exist!", 409))
    }
    if (password && confirmPassword) {
      if (password.length < 7) {
        return next(new ApiError("Minimum password are 7 character!", 400))
      }
      if (password != confirmPassword) {
        return next(new ApiError("Password and confirmPassword must be the same!", 400))
      }
    }
    if (role == "superadmin" || role == "admin") {
      return next(
        new ApiError(
          "This register routes only accept register for role member!. Access to register as a superadmin and admin blocked!. User with role superadmin are made by developer and user with role admin are made by superadmin",
          403
        )
      )
    }
    const newUser = await User.create({
      name,
      age,
      address,
      role
    })
    const newAuth = await Auth.create({
      email,
      password,
      confirmPassword,
      userId: newUser.id
    })
    res.status(201).json({
      status: "Success",
      message: "Register as a member successfully",
      data: {
        data: {
          ...newUser,
          newAuth
        }
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// login for superadmin, admin, and member
exports.login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return next(new ApiError("Email and password are requred for login", 400))
    }
    const auth = await Auth.findOne({
      where: { email },
      include: [
        {
          model: User,
          attributes: { exclude: ["createdAt", "updatedAt"] }
        }
      ]
    })
    if (!auth) {
      return next(new ApiError("Email does not exist, register instead", 401))
    }
    const comparePasswordToDB = await auth.comparePasswordToDB(password, auth.password)
    if (comparePasswordToDB === false) {
      return next(new ApiError("Password doesn't match", 400))
    }
    if (auth && comparePasswordToDB) {
      const token = jwt.sign(
        {
          id: auth.userId,
          name: auth.User.name,
          email: auth.email,
          role: auth.User.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIREDIN }
      )
      res.status(200).json({
        status: "Success",
        message: "Login successfully",
        token: token
      })
    }
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// for see the details of user by token
exports.currentUser = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req)
    const dataPayloadUser = payloadUser(token)
    const user = await User.findOne({ where: { id: dataPayloadUser.id }, include: ["Auth"] })
    res.status(200).json({
      status: "Success",
      message: `Success user details of ${user.name} fetched`,
      data: {
        user
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin can access this
exports.getAuths = async (req, res, next) => {
  try {
    const auth = await Auth.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["age", "address", "createdAt", "updatedAt"] }
        }
      ]
    })
    res.status(200).json({
      status: "Success",
      message: "Auths fetched successfully",
      data: {
        auth
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin and his own data can access this to update user auth by id
exports.updateAuth = async (req, res, next) => {
  const { id } = req.params
  const { email, password, confirmPassword } = req.body
  try {
    const auth = await Auth.findOne({ where: { id } })
    if (!auth) {
      return next(new ApiError(`Auth with id ${id} are not exist!`, 404))
    }
    let hashPasw
    if (password && confirmPassword) {
      if (password.length < 7) {
        return next(new ApiError("Minimum password are 7 character!", 400))
      }
      if (password != confirmPassword) {
        return next(new ApiError("Password and confirmPassword must be the same!", 400))
      }
      const salt = await bcrypt.genSalt(10)
      hashPasw = await bcrypt.hash(password, salt)
    }
    const updateAuth = await Auth.update(
      {
        email,
        password: hashPasw,
        confirmPassword: hashPasw
      },
      { where: { id }, returning: true }
    )
    res.status(200).json({
      status: "Success",
      message: `Auth updated successfully`,
      data: {
        updateAuth
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

// only superadmin and his own data can access this to delete user auth by id
exports.deleteAuth = async (req, res, next) => {
  const { id } = req.params
  try {
    const auth = await Auth.findOne({ where: { id } })
    if (!auth) {
      return res.status(404).json({
        status: "Not found",
        message: `Auth with id ${id} are not exist!`
      })
    }
    await Auth.destroy({ where: { id } })
    res.status(200).json({
      status: "Success",
      message: `Auth deleted successfully`,
      data: {
        auth: null
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}
