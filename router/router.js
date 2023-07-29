const express = require("express")
const router = express.Router()

const indexController = require("../controllers/indexController")
const loginController = require("../controllers/loginController")
const signupController = require("../controllers/signupController")
const homeController = require("../controllers/homeController")
const notFoundController = require("../controllers/notFoundController")
const logoutController = require("../controllers/logoutController")

const authMiddleware = require("../middlewares/authMiddleware")
const checkSignupDataMiddleware = require("../middlewares/checkSignupDataMiddleware")
const checkLoginDataMiddleware = require("../middlewares/checkLoginDataMiddleware")
const checkIfAlreadyLogged = require("../middlewares/checkIfAlreadyLogged")

router.get("/", indexController.index)
router.get("/session/new", checkIfAlreadyLogged, loginController.login)
router.get("/session/destroy", logoutController.logout)
router.get("/users/new", checkIfAlreadyLogged, signupController.signup)
router.get("/home", authMiddleware, homeController.home)
router.get("*", notFoundController.notFound)

router.post(
  "/users/new",
  checkSignupDataMiddleware,
  signupController.signupPost
)
router.post("/session/new", checkLoginDataMiddleware, loginController.loginPost)

module.exports = router
