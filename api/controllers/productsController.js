const mongoose = require('mongoose')

const Product = require('../models/products')

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: '/' + doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.products_post = (req, res, next) => {
  console.log(req.file)

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Product created successfully',
        created: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: '/' + result.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost/products/' + result._id
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

exports.products_get = (req, res, next) => {
  const id = req.params.productId

  Product.findById(id)
    .select('name price _id productImage')
    .then(doc => {
      if (doc) {
        res.status(200).json({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          productImage: '/' + doc.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/'
          }
        })
      } else {
        res.status(404).json({
          message: 'Product not found',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/'
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

exports.products_patch = (req, res, next) => {
  const id = req.params.productId

  const updateOps = {}

  for (var i in req.body) {
    const op = req.body[i]
    updateOps[op.propName] = op.value
  }

  Product.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
    .then(result => {
      res.status(200).json({
        name: result.name,
        price: result.price,
        _id: result._id,
        productImage: '/' + result.productImage,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + result._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.products_delete = (req, res, next) => {
  const id = req.params.productId

  Product.findByIdAndDelete(id)
    .then(result => {
      res.status(200).json({
        message: 'Product deleted successfully',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'price',
            productImage: 'Image'
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

exports.products_delete_all = (req, res, next) => {
  Product.deleteMany()
    .then(result => {
      res.status(200).json({
        message: 'All products successfully deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          data: {
            name: 'String',
            price: 'Number',
            productImage: 'Image'
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