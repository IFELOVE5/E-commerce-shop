const express = require('express');
const { allOrders, newOrder, getOrder, updateOrder, deleteOrder, total, countOrders, getorderUser } = require('../Controllers/order_controllers');

const route = express.Router()

route.get(`/all`, allOrders)

route.post(`/add`, newOrder)

route.get(`/get/:id`, getOrder)

route.put(`/update/:id`, updateOrder)

route.delete(`/delete/:id`, deleteOrder)

route.get(`/total`, total)

route.get(`/count`, countOrders)

route.get(`/:userid`, getorderUser)







module.exports = route