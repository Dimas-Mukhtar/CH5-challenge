const ApiError = require("../utils/apiError")

const checkTokenFromHeaders = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) return next(new ApiError("No token, your access is blocked!", 403))
    next()
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

module.exports = checkTokenFromHeaders
