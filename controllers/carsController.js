const { Car, User } = require("../models")
const { Op } = require("sequelize")
const getTokenFromHeaders = require("../middlewares/getTokenFromHeaders")
const payloadUser = require("../middlewares/payloadUser")
const ApiError = require("../utils/apiError")

exports.createCar = async (req, res, next) => {
  const { name, price, category } = req.body
  try {
    const token = getTokenFromHeaders(req)
    const dataPayloadUser = payloadUser(token)
    const newCar = await Car.create({
      name,
      price,
      category,
      userId: dataPayloadUser.id
    })
    res.status(201).json({
      status: "Success",
      message: `Congrats ${dataPayloadUser.name}, creating car successfully`,
      data: {
        newCar
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

exports.getCars = async (req, res, next) => {
  const { name, user } = req.query
  try {
    const condition = {}
    if (name) condition.name = { [Op.iLike]: `%${name}%` }
    const cars = await Car.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["age", "address", "createdAt", "updatedAt"]
          }
        }
      ],
      where: condition
    })
    res.status(200).json({
      status: "Success",
      message: "Cars fetched successfully",
      data: {
        cars
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

exports.getCar = async (req, res, next) => {
  const { id } = req.params
  try {
    const car = await Car.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: { exclude: ["age", "address", "createdAt", "updatedAt"] }
        }
      ]
    })
    if (!car) {
      return next(new ApiError(`Car with id ${id} are not exist!`, 404))
    }
    res.status(200).json({
      status: "Success",
      message: `Car with name ${car.name} fetched successfully`,
      data: {
        car
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

exports.updateCar = async (req, res, next) => {
  const { id } = req.params
  const { name, price, category } = req.body
  try {
    const car = await Car.findOne({ where: { id } })
    if (!car) {
      return next(new ApiError(`Car with id ${id} are not exist!`, 404))
    }
    const updatedCar = await car.update(
      {
        name,
        price,
        category
      },
      { where: { id }, returning: true }
    )
    res.status(200).json({
      status: "Success",
      message: `Car with name ${car.name} updated successfully`,
      data: {
        updatedCar
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

exports.deleteCar = async (req, res, next) => {
  const { id } = req.params
  try {
    const car = await Car.findOne({ where: { id } })
    if (!car) {
      return next(new ApiError(`Car with id ${id} are not exist!`, 404))
    }
    await Car.destroy({ where: { id } })
    res.status(200).json({
      status: "Success",
      message: `Car with name ${car.name} deleted successfully`,
      data: {
        car: null
      }
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
