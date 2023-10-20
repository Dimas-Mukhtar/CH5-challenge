class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    switch (statusCode) {
      case 400:
        this.status = "Bad request"
        break
      case 401:
        this.status = "Unauthorized"
        break
      case 403:
        this.status = "Forbidden"
        break
      case 404:
        this.status = "Not found"
        break
      case 409:
        this.status = "Conflict"
        break
      case 500:
        this.status = "Error"
        break
    }
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError
