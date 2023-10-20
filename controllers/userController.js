const bcrypt = require("bcryptjs")
const { User, Auth } = require("../models")
const ApiError = require("../utils/apiError")

// only superadmin can access this for get all the users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Auth,
          attributes: { exclude: ["createdAt", "updatedAt"] }
        }
      ]
    })
    res.status(200).json({
      status: "Success",
      message: "User fetched successfully",
      data: {
        users
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin can access this for create a user with role admin or member
exports.createUser = async (req, res, next) => {
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
      message: `User ${name} created successfully`,
      data: {
        ...newUser,
        newAuth
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin can access this for get user by id
exports.getUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Auth,
          attributes: { exclude: ["createdAt", "updatedAt"] }
        }
      ]
    })
    if (!user) {
      return next(new ApiError(`User with id ${id} are not exist!`, 404))
    }
    res.status(200).json({
      status: "Success",
      message: `User with name ${user.name} fethed successfully`,
      data: {
        user
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin and his own data can access this for update user by id
exports.updateUser = async (req, res, next) => {
  const { id } = req.params
  const { name, age, address, role, email, password, confirmPassword } = req.body
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return next(new ApiError(`User with id ${id} are not exist!`, 404))
    }
    if (password && confirmPassword) {
      if (password.length < 7) {
        return next(new ApiError("Minimum password are 7 character!", 400))
      }
      if (password != confirmPassword) {
        return next(new ApiError("Password and confirmPassword must be the same!", 400))
      }
    }
    const salt = await bcrypt.genSalt(10)
    const hashPasw = await bcrypt.hash(password, salt)
    const updatedUser = await User.update(
      {
        name,
        age,
        address,
        role
      },
      { where: { id }, returning: true }
    )

    const updatedAuth = await Auth.update(
      {
        email,
        password: hashPasw,
        confirmPassword: hashPasw
      },
      { where: { userId: id }, returning: true }
    )
    res.status(200).json({
      status: "Success",
      message: `User with name ${user.name} updated successfully`,
      data: {
        ...updatedUser,
        updatedAuth
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

// only superadmin and his own data can access this for delete user by id
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return next(new ApiError(`User with id ${id} are not exist!`, 404))
    }
    await User.destroy({ where: { id } })
    res.status(200).json({
      status: "Success",
      message: `User with name ${user.name} deleted successfully`,
      data: {
        user: null
      }
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}
