const mongoose = require('mongoose')
const { userConnection } = require('../helpers/db_connect')

const schema = mongoose.Schema

const NoteSchema = new schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
})

module.exports = userConnection.model('notes', NoteSchema)
