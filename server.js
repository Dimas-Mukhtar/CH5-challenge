require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const swaggerUI = require("swagger-ui-express")
const bodyParser = require("body-parser")

const swaggerDocument = require("./docs/swagger.json")
const PORT = process.env.PORT || 3000
const userRoutes = require("./routes/userRouter")
const authRoutes = require("./routes/authRouter")
const carRoutes = require("./routes/carRouter")
const errorHandler = require("./middlewares/errorHandler")
const ApiError = require("./utils/apiError")

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

app.use("/api-docs", swaggerUI.serve)
app.use("/api-docs", swaggerUI.setup(swaggerDocument))

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/cars", carRoutes)

app.all("*", (req, res, next) => {
  return next(new ApiError("Routes does not exist", 404))
})
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
