require("dotenv").config()
const UserService = require("../services/userService")
const LoginController = require("./loginController")

class SignupController {
  static signup(req, res) {
    const form = req.flash("form")[0] || {}
    const errors = req.flash("errors") || []
    res.render("signup", { title: "Pancake - Signup", form, errors })
  }

  static async signupPost(req, res) {
    const { username, email, password } = req.body || {}

    try {
      await UserService.signup(username, password, email)

      // authenticate user and generate token
      const user = await UserService.login(email, password)
      const token = LoginController.createJwtToken(user)

      LoginController.createAuthCookie(res, token)

      return res.redirect("/home")
    } catch (err) {
      req.flash("form", { username, email })
      req.flash("errors", [err.message])
      return res.redirect("/users/new")
    }
  }
}

module.exports = SignupController
