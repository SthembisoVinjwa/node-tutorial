const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-token')

const UsersController = require('../controllers/usersController')

// User sign up
router.post('/signup', UsersController.users_signup)

// Login a user
router.post('/login', UsersController.users_login)

// Delete a user
router.delete('/:userId', checkAuth, UsersController.users_delete)

// Get All Users
router.get('/', UsersController.users_get_all)

module.exports = router
