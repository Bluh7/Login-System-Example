class IndexController {
  static index(req, res) {
    res.render("index", { title: "Pancake" })
  }
}

module.exports = IndexController
