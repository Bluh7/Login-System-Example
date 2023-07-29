require("dotenv").config()
const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) return res.redirect("/session/new")

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.clearCookie("jwt")
    return res.redirect("/session/new")
  }
}

module.exports = authMiddleware
