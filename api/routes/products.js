const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-token.js')

const ProductsController = require('../controllers/productsController.js')

const multer = require('multer')

// Set File path and name
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// Filter files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Add storage to upload ans set limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
})

// Get all products
router.get('/', ProductsController.products_get_all)

// Create a new product
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_post)

// Get a product
router.get('/:productId', checkAuth, ProductsController.products_get)

// Update a product
router.patch('/:productId', checkAuth, ProductsController.products_patch)

// Delete a product
router.delete('/:productId', checkAuth, ProductsController.products_delete)

// Delete all products
router.delete('/', checkAuth, ProductsController.products_delete_all);

module.exports = router
