const { createOrder, successOrder, codOrder } = require('../controller/orderController')
const { authenticateUser } = require('../middleware/authenticate')
const orderRouter = require('express').Router()

orderRouter.post("/orders", authenticateUser, createOrder)
orderRouter.post("/success", authenticateUser, successOrder)
orderRouter.post("/cod-order", authenticateUser, codOrder)

module.exports = orderRouter