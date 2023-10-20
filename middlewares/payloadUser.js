const jwt = require("jsonwebtoken")
const payloadUser = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return "FAILED"
    return decoded
  })
}

module.exports = payloadUser
