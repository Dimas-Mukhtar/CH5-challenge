const router = require("express").Router()
const carController = require("../controllers/carsController")
const checkTokenFromHeaders = require("../middlewares/checkTokenFromHeaders")
const isTokenNull = require("../middlewares/isTokenNull")
const memberCannotManageCar = require("../middlewares/memberCannotManageCar")

router
  .route("/")
  .post(checkTokenFromHeaders, isTokenNull, memberCannotManageCar, carController.createCar)
  .get(checkTokenFromHeaders, isTokenNull, memberCannotManageCar, carController.getCars)
router
  .route("/:id")
  .get(checkTokenFromHeaders, isTokenNull, memberCannotManageCar, carController.getCar)
  .put(checkTokenFromHeaders, isTokenNull, memberCannotManageCar, carController.updateCar)
  .delete(checkTokenFromHeaders, isTokenNull, memberCannotManageCar, carController.deleteCar)

module.exports = router
