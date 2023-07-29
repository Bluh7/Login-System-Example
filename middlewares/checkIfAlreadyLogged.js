const checkIfAlreadyLogged = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) return res.redirect("/home")

  next()
}

module.exports = checkIfAlreadyLogged
