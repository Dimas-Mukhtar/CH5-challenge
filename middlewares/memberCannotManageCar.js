const getTokenFromHeaders = require("./getTokenFromHeaders")
const payloadUser = require("./payloadUser")
const ApiError = require("../utils/apiError")

const memberCannotManageCar = (req, res, next) => {
  const token = getTokenFromHeaders(req)
  const dataPayloadUser = payloadUser(token)
  if (dataPayloadUser.role == "member") {
    return next(
      new ApiError(
        "Your access to this is blocked!, cause you is member. only superadmin and admin can access this!",
        403
      )
    )
  }
  next()
}

module.exports = memberCannotManageCar
