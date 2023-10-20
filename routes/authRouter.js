const router = require("express").Router()
const authController = require("../controllers/authController")
const checkTokenFromHeaders = require("../middlewares/checkTokenFromHeaders")
const isTokenNull = require("../middlewares/isTokenNull")
const isSuperAdmin = require("../middlewares/isSuperAdmin")
const isOwnData = require("../middlewares/isOwnData")

router.route("/register").post(authController.register) // register routes for member only
router.route("/login").post(authController.login) // register routes for superadmin, admin, and member
router.route("/current-user").get(checkTokenFromHeaders, isTokenNull, authController.currentUser)
router.route("/").get(checkTokenFromHeaders, isTokenNull, isSuperAdmin, authController.getAuths)
router
  .route("/:id")
  .delete(checkTokenFromHeaders, isTokenNull, isOwnData, authController.deleteAuth)
  .put(checkTokenFromHeaders, isTokenNull, isOwnData, authController.updateAuth)

module.exports = router
