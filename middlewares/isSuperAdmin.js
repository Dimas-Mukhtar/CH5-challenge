const getTokenFromHeaders = require("./getTokenFromHeaders")
const payloadUser = require("./payloadUser")
const ApiError = require("../utils/apiError")

const isSuperAdmin = (req, res, next) => {
  const token = getTokenFromHeaders(req)
  const dataPayloadUser = payloadUser(token)
  if (dataPayloadUser.role != "superadmin") {
    return next(
      new ApiError("Your access to this is blocked!, only superadmin can access this!", 403)
    )
  }
  next()
}

module.exports = isSuperAdmin
