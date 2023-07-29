const Joi = require("joi")

const checkSignupData = async (req, res, next) => {
  const form = { ...req.body } || {}

  // RFC 5322 compliant email regex
  const emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  )
  // alphanumeric and underscore characters only
  const usernameRegex = new RegExp("^[a-zA-Z0-9_]*$")

  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(20)
      .required()
      .pattern(usernameRegex)
      .messages({
        "string.base": "The username should be a text",
        "string.empty": "The username is required",
        "string.pattern.base":
          "The username should only contain letters, numbers and underscores",
        "string.min":
          "The username should have a minimum length of {#limit} characters",
        "string.max":
          "The username should have a maximum length of {#limit} characters",
        "any.required": "The username is required",
      }),
    email: Joi.string().required().pattern(emailRegex).messages({
      "string.base": "The email should be a text",
      "string.empty": "The email is required",
      "string.pattern.base": "This email is not valid",
      "any.required": "The email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "The password should be a text",
      "string.empty": "The password is required",
      "string.min":
        "The password should have a minimum length of {#limit} characters",
      "any.required": "The password is required",
    }),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.only": "The passwords don't match",
        "any.required": "The password confirmation is required",
        "string.base": "The password confirmation should be a text",
      }),
  })

  // Test all the data sent from the form against the Joi schema
  // If there're errors, redirect to the signup page with the errors and the form data
  try {
    await schema.validateAsync(form, { abortEarly: false })
    next()
  } catch (err) {
    const errors = err.details.map(detail => detail.message)

    // Clear both password fields for security
    form.password = null
    form.confirmPassword = null

    req.flash("errors", errors)
    req.flash("form", form)

    return res.redirect("/users/new")
  }
}

module.exports = checkSignupData
