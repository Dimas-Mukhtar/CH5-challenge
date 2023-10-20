const getTokenFromHeaders = require("./getTokenFromHeaders")
const payloadUser = require("./payloadUser")
const ApiError = require("../utils/apiError")

const isTokenNull = (req, res, next) => {
  const token = getTokenFromHeaders(req)
  const dataPayloadUser = payloadUser(token)
  if (dataPayloadUser.id == null) {
    return next(
      new ApiError("Your access to this is blocked!, you have invalid token or expired token!", 403)
    )
  }
  next()
}

module.exports = isTokenNull
