class HomeController {
  static home(req, res) {
    const { user } = req
    res.render("home", { title: "Pancake - Home", user })
  }
}

module.exports = HomeController
