const getTokenFromHeaders = (req) => {
  const token = req.headers.authorization
  const realToken = token.split(" ")[1]
  if (realToken) return realToken
  return {
    status: "Faileddddddd"
  }
}

module.exports = getTokenFromHeaders
