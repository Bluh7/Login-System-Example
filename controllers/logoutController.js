class LogoutController {
  static logout(req, res) {
    res.clearCookie("jwt")
    return res.redirect("/session/new")
  }
}

module.exports = LogoutController
