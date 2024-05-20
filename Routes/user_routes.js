const express = require('express')

const { getUsers, addUser, getUser, userLogin, dUser, countUsers } = require('../Controllers/user_controller')

const authRoute = express.Router()

authRoute.get('/all', getUsers)

authRoute.post('/add', addUser)

authRoute.get('/get/:id', getUser)

authRoute.post('/login', userLogin)

authRoute.delete(`/delete/:id`, dUser)

authRoute.get( `/count`, countUsers)

module.exports= authRoute