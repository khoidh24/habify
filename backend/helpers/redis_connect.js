const redis = require('redis')

const client = redis.createClient()

client.on('error', (err) => {
  console.error(`Error: ${err}`)
})

client.on('connect', () => {
  console.log('Connected to Redis')
})

client.on('ready', () => {
  console.log('Redis is ready to use')
})

module.exports = client
