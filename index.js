require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const router = require("./router/router")

const app = express()
const PORT = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI
const sessionSecret = process.env.SESSION_SECRET

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB successfully")
  })
  .catch(err => {
    console.log(`Error while trying to connect with MongoDB\n ${err}`)
    process.exit(1)
  })

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
)

app.use(flash())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))
app.set("views", "views")
app.set("view engine", "ejs")

app.use(router)

const appServer = app.listen(PORT, err => {
  if (err) throw err
  console.log(`Server is running on port ${PORT}`)
})

// SIGINT is sent from the terminal like Ctrl + C
// SIGTERM is sent from the operating system like kill command
if (process.env.NODE_ENV !== "production") {
  process.on("SIGINT" || "SIGTERM", async signal => {
    console.log(`${signal} signal received: closing HTTP server...`)
    console.log("Closing MongoDB connection...")

    try {
      await mongoose.disconnect()
      console.log("MongoDB connection closed")
    } catch (err) {
      console.log(`Error while trying to close MongoDB connection\n ${err}`)
    }

    appServer.close(() => {
      console.log("HTTP server closed")
    })
  })
}
