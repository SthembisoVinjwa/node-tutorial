const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(
  'mongodb+srv://vinjwacr7:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-shop.0wzlren.mongodb.net/?retryWrites=true&w=majority'
)

// Prevent CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    res.status(200).json({})
  }
  next()
})

const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')
const usersRouter = require('./api/routes/users')

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)

// Throw 404 error
app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

// Handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})

module.exports = app
