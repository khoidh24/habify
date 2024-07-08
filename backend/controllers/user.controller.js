const createError = require('http-errors')
const User = require('../models/user.model')
const { userValidate } = require('../helpers/validation')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../helpers/protect_route')
const client = require('../helpers/redis_connect')

// REGISTER
const register = async (req, res, next) => {
  try {
    // Destructure the email and password from the request body
    const { email, password } = req.body
    // Validate the request body
    const { error } = userValidate(req.body)
    if (error) {
      console.log(`:::::Error Validation: ${error}`)
      throw createError(error.details[0].message)
    }

    // Check if the user already exists
    const isExist = await User.findOne({ email })
    if (isExist) {
      throw createError.Conflict(`${email} is already registered`)
    }
    // Create a new user
    const user = new User({
      email,
      password,
      username: email.split('@')[0] + (Math.random() * 100000).toFixed(0)
    })
    const savedUser = await user.save()

    return res.json({ savedUser })
  } catch (err) {
    next(err)
  }
}

// LOGIN
const login = async (req, res, next) => {
  try {
    // Destructure the email and password from the request body
    const { email, password } = req.body
    // Validate the request body
    const { error } = userValidate(req.body)
    if (error) {
      console.log(`:::::Error Validation: ${error}`)
      throw createError(error.details[0].message)
    }

    // Check if the user does not exist
    const user = await User.findOne({ email })
    if (!user) {
      throw createError.NotFound('User have not been registered yet')
    }

    // Check if the password is not correct
    const isValid = await user.isCheckPassword(password)
    if (!isValid) {
      throw createError.Unauthorized('Invalid credentials')
    }

    // Generate the token
    const accessToken = await signAccessToken(user._id)
    const refreshToken = await signRefreshToken(user._id)
    res.json({
      accessToken,
      refreshToken
    })
  } catch (err) {
    next(err)
  }
}

// LOGOUT
const logout = async (req, res, next) => {
  try {
    // Get Refresh Token from body
    const { refreshToken } = req.body
    // Check if the refresh token is not present
    if (!refreshToken) {
      throw createError.BadRequest()
    }
    // Verify the refresh token and get the userId
    const { userId } = await verifyRefreshToken(refreshToken)
    // Delete the userId from Redis using the refresh token as a key
    client.del(userId.toString(), (err, reply) => {
      if (err) {
        throw createError.InternalServerError()
      }
      res.json({
        status: 200,
        message: 'Logged out successfully'
      })
    })
  } catch (err) {
    next(err)
  }
}

// REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    // Get Refresh Token from body
    const { refreshToken } = req.body
    // Check if the refresh token is not present
    if (!refreshToken) {
      throw createError.BadRequest()
    }
    // Verify the refresh token and get the userId
    const { userId } = await verifyRefreshToken(refreshToken)
    // Generate the new access token with the userId
    const accessToken = await signAccessToken(userId)
    // Generate a new refresh token with the userId
    const newRefreshToken = await signRefreshToken(userId)
    // Return the new access and refresh tokens to the client
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    })
  } catch (err) {
    next(err)
  }
}

// GET LISTS EXAMPLE
const getLists = (req, res, next) => {
  const listUsers = [
    {
      email: 'abc@gmail.com'
    },
    {
      email: 'def@gmail.com'
    }
  ]
  res.json({
    status: 200,
    elements: listUsers
  })
}

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getLists
}
