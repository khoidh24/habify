const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/protect_route')
const NoteController = require('../controllers/note.controller')

// GET NOTE
router.get('/', verifyAccessToken, NoteController.getNoteList)

// GET NOTE BY ID
router.get('/:noteId', verifyAccessToken, NoteController.getSpecificNote)

// CREATE NOTE
router.post('/create', verifyAccessToken, NoteController.createNote)

// UPDATE NOTE
router.put('/update/:noteId', verifyAccessToken, NoteController.updateNote)

// DELETE NOTE
router.delete('/delete/:noteId', verifyAccessToken, NoteController.deleteNote)

module.exports = router
