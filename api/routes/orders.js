const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-token')

const OrdersController = require('../controllers/ordersController')

// Get all orders
router.get('/', checkAuth, OrdersController.orders_get_all)

// Post an order
router.post('/', checkAuth, OrdersController.orders_post)

// Get a single order
router.get('/:orderId', checkAuth, OrdersController.orders_get)

// Delete an order
router.delete('/:orderId', checkAuth, OrdersController.orders_delete)

// Delete all orders
router.delete('/', checkAuth, OrdersController.orders_delete_all);

module.exports = router
