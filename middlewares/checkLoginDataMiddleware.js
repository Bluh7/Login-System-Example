const Joi = require("joi")

const checkLoginData = async (req, res, next) => {
  // RFC 5322 compliant email regex
  const emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  )

  const form = { ...req.body } || {}

  const schema = Joi.object({
    email: Joi.string().required().pattern(emailRegex).messages({
      "string.base": "The email should be a text",
      "string.empty": "The email is required",
      "string.pattern.base": "This email is not valid",
      "any.required": "The email is required",
    }),
    password: Joi.string().required().messages({
      "string.base": "The password should be a text",
      "string.empty": "The password is required",
      "any.required": "The password is required",
    }),
  })

  // Test all the data sent from the form against the Joi schema
  // If there're errors, redirect to the login page with the errors and the form data
  try {
    await schema.validateAsync(form, { abortEarly: false })
    next()
  } catch (err) {
    const errors = err.details.map(detail => detail.message)

    // Clear the password field for security
    form.password = null

    req.flash("errors", errors)
    req.flash("form", form)

    return res.redirect("/session/new")
  }
}

module.exports = checkLoginData
