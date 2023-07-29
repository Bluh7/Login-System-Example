const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

class UserService {
  static async login(email, password) {
    try {
      const user = await User.findOne({ email })

      if (!user) throw new Error("Email or password is incorrect")

      const passwordMatch = await UserService.comparePassword(
        password,
        user.password
      )

      // Using the same error message to prevent user enumeration
      if (!passwordMatch) throw new Error("Email or password is incorrect")

      return user
    } catch (err) {
      throw err
    }
  }

  static async signup(username, password, email) {
    try {
      const user = await User.findOne({ email })

      if (user) throw new Error("Email already in use")

      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)

      await User.create({
        username,
        password: hashedPassword,
        email,
      })
    } catch (err) {
      throw err
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findById(id)

      if (!user) throw new Error("User not found")

      return user
    } catch (err) {
      throw err
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email })

      if (!user) throw new Error("User not found")

      return user
    } catch (err) {
      throw err
    }
  }

  static async comparePassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword)
      return isMatch
    } catch (err) {
      throw err
    }
  }
}

module.exports = UserService
