const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
})

const product = mongoose.model('Product', productSchema)
module.exports = product
