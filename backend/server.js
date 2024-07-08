const express = require('express')
const createError = require('http-errors')
const app = express()
require('dotenv').config()
const UserRoute = require('./routes/user.routes')
const NoteRoute = require('./routes/note.routes')

app.get('/', (req, res, next) => {
  res.send('Hello World')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/note', NoteRoute)
app.use('/', UserRoute)

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist.'))
})

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 404,
    message: err.message
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`)
})
