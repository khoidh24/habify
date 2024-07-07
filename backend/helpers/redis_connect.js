const redis = require('redis')

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1'
})

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
