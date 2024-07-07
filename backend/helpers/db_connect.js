const mongoose = require('mongoose')
require('dotenv').config()

function newConnection(uri) {
  const connection = mongoose.createConnection(uri)

  connection.on('connected', function () {
    console.log(`MongoDB :::connected::: ${this.name}`)
  })

  connection.on('disconnected', function () {
    console.log(`MongoDB :::disconnected::: ${this.name}`)
  })

  connection.on('error', function (err) {
    console.log(`MongoDB :::error::: ${JSON.stringify(err)}`)
  })

  process.on('SIGINT', async () => {
    await connection.close()
    process.exit(0)
  })

  return connection
}

// Update the URI to include the database name at the end
const userConnection = newConnection(process.env.DATABASE_URI)

module.exports = { userConnection }
