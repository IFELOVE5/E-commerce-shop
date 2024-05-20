const express = require('express')
const { getAllCategories, addCategory, deleteCat, catById, updateCat } = require('../Controllers/category_controller')


const catRouter = express.Router()

catRouter.get('/all', getAllCategories)

catRouter.post('/new', addCategory)

catRouter.delete('/delete/:id', deleteCat)

catRouter.get('/get/:id', catById)

catRouter.put('/update/:id', updateCat)

module.exports = catRouter