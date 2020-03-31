const express = require('express')
const router = express.Router()

const userController = require('./controllers/userController')
const loadController = require('./controllers/loadController')
const truckController = require('./controllers/truckController')

// user related routes
router.get('/', userController.home)
router.post ('/register', userController.register)
router.post ('/login', userController.login)
router.post ('/logout', userController.logout)

// profile routes
router.get('/profile/:username', userController.ifUserExists, userController.profileScreen)

// load related routes
router.get('/create-load', userController.mustBeLoggedIn, loadController.viewCreateScreen)
router.post('/create-load', userController.mustBeLoggedIn, loadController.create)
router.get('/load/:id', loadController.viewSingle)

// truck related routes
router.get('/create-truck', userController.mustBeLoggedIn, truckController.viewCreateScreen)
router.post('/create-truck', userController.mustBeLoggedIn, truckController.create)
router.get('/truck/:id', truckController.viewSingle)

module.exports = router