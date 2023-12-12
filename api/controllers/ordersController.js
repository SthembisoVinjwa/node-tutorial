const mongoose = require('mongoose')

const Order = require('../models/orders')
const Product = require('../models/products')

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_post = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: 'Product does not exist',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/'
          }
        })
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })

      return order
        .save()
        .then(result => {
          res.status(201).json({
            message: 'Order created successfully',
            created: {
              product: result.product,
              quantity: result.quantity,
              _id: result._id
            },
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + result.id
            }
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_get = (req, res, next) => {
  const id = req.params.orderId

  Order.findById(id)
    .select('product quantity _id')
    .populate('product', 'name price productImage')
    .then(doc => {
      if (doc) {
        res.status(200).json({
          order: {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/'
          }
        })
      } else {
        res.status(404).json({
          message: 'Order not found',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/'
          }
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_delete = (req, res, next) => {
  const id = req.params.orderId

  Order.findByIdAndDelete(id)
    .then(result => {
      res.status(200).json({
        message: 'Order deleted successfully',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {
            productId: 'Id',
            quantity: 'Number'
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_delete_all = (req, res, next) => {
  Order.deleteMany()
    .then(result => {
      res.status(200).json({
        message: 'All orders successfully deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          data: {
            productId: 'Id',
            quantity: 'Number'
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}