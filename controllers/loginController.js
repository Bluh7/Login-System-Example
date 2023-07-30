require("dotenv").config()
const UserService = require("../services/userService")
const jwt = require("jsonwebtoken")

class LoginController {
  static login(req, res) {
    const form = req.flash("form")[0] || {}
    const errors = req.flash("errors") || []
    res.render("login", { title: "Pancake - Login", form, errors })
  }

  static createJwtToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    )
  }

  static createAuthCookie(res, token) {
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === "production",
    })
  }

  static async loginPost(req, res) {
    const { email, password } = req.body || {}

    try {
      // authenticate user and generate token
      const user = await UserService.login(email, password)
      const token = LoginController.createJwtToken(user)

      LoginController.createAuthCookie(res, token)

      return res.redirect("/home")
    } catch (err) {
      req.flash("form", { email })
      req.flash("errors", [err.message])
      return res.redirect("/session/new")
    }
  }
}

module.exports = LoginController
