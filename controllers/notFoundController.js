class NotFoundController {
  static notFound(req, res) {
    res.render("404", { title: "Pancake - 404" })
  }
}

module.exports = NotFoundController
