const mongoose = require('mongoose')
const { userConnection } = require('../helpers/db_connect')
const bcrypt = require('bcrypt')

const schema = mongoose.Schema

const UserSchema = new schema({
  username: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (err) {}
}

module.exports = userConnection.model('users', UserSchema)
