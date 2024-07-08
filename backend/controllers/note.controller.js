const createError = require('http-errors')
const Note = require('../models/note.model')
const User = require('../models/user.model')

// GET NOTE LIST
const getNoteList = async (req, res, next) => {
  try {
    const note = await Note.find({ user: userId })
    if (!note) {
      throw createError.NotFound('Note not found')
    }
    res.json({ noteList: note })
  } catch (err) {
    next(err)
  }
}

// GET NOTE FROM ID
const getSpecificNote = async (req, res, next) => {
  try {
    const { userId } = req.payload.userId
    const user = await User.findOne(userId)
    if (!user) {
      throw createError.NotFound('User not found')
    }
    const { noteId } = req.params
    const note = await Note.findById(noteId)
    if (!note) {
      throw createError.NotFound('Note not found')
    }
    res.json({ noteList: note })
  } catch (err) {
    next(err)
  }
}

// CREATE NOTE
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body
    const { userId } = req.payload.userId
    const user = await User.findOne(userId)
    const note = new Note({
      title,
      content,
      user: user._id
    })
    const savedNote = await note.save()
    user.noteList.push(savedNote._id)
    await user.save()
    res.json({ noteList: savedNote })
  } catch (err) {
    next(err)
  }
}

// UPDATE NOTE
const updateNote = async (req, res, next) => {
  try {
    const { userId } = req.payload.userId
    const { noteId } = req.params
    const { title, content } = req.body
    const user = await User.findOne(userId)
    if (!user) {
      throw createError.NotFound('User not found')
    }
    const note = await Note.findById(noteId)
    if (!note) {
      throw createError.NotFound('Note not found')
    }
    note.title = title !== undefined ? title : note.title
    note.content = content !== undefined ? content : note.content
    const updatedNote = await note.save()
    res.json({ noteList: updatedNote })
  } catch (err) {
    next(err)
  }
}

// DELETE NOTE
const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const userId = req.payload.userId
    const note = await Note.findById(noteId)
    if (!note) {
      throw createError.NotFound('Note not found')
    }
    if (note.user.toString() !== userId) {
      throw createError.Unauthorized(
        'You are not authorized to delete this note'
      )
    }
    await Note.deleteOne({ _id: noteId }) // Deletes the note
    const user = await User.findById(userId)
    if (user) {
      user.noteList.pull(noteId) // Remove noteId from user's notes array
      await user.save()
    }
    res.status(200).json({ message: 'Note deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getNoteList,
  getSpecificNote,
  createNote,
  updateNote,
  deleteNote
}
