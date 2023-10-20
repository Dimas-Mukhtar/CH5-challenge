const getTokenFromHeaders = require("./getTokenFromHeaders")
const payloadUser = require("./payloadUser")
const ApiError = require("../utils/apiError")

const isOwnData = (req, res, next) => {
  const { id } = req.params
  const token = getTokenFromHeaders(req)
  const dataPayloadUser = payloadUser(token)
  if (dataPayloadUser.id != id && dataPayloadUser.role != "superadmin") {
    return next(
      new ApiError(
        "Your access to this is blocked!, you only have access to update and delete yourself",
        403
      )
    )
  }
  next()
}

module.exports = isOwnData
