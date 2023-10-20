const router = require("express").Router()
const userController = require("../controllers/userController")
const checkTokenFromHeaders = require("../middlewares/checkTokenFromHeaders")
const isTokenNull = require("../middlewares/isTokenNull")
const isSuperAdmin = require("../middlewares/isSuperAdmin")
const isOwnData = require("../middlewares/isOwnData")

// routes manage the users
router
  .route("/")
  .get(checkTokenFromHeaders, isTokenNull, isSuperAdmin, userController.getUsers)
  .post(checkTokenFromHeaders, isTokenNull, isSuperAdmin, userController.createUser)
router
  .route("/:id")
  .get(checkTokenFromHeaders, isTokenNull, isSuperAdmin, userController.getUser)
  .put(checkTokenFromHeaders, isTokenNull, isOwnData, userController.updateUser)
  .delete(checkTokenFromHeaders, isTokenNull, isOwnData, userController.deleteUser)

module.exports = router
