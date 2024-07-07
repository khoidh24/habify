const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/protect_route')
const UserController = require('../controllers/user.controller')

// REGISTER
router.post('/register', UserController.register)

// LOGIN
router.post('/login', UserController.login)

// LOGOUT
router.delete('/logout', UserController.logout)

// REFRESH TOKEN
router.post('/refresh-token', UserController.refreshToken)

router.get('/getLists', verifyAccessToken, UserController.getLists)

module.exports = router
