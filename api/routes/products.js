const express = require('express');
const router = express.Router();
const multer = require ('multer');
const Product_controller = require('../controllers/product')

//import middleware
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = new Date().toISOString()
      cb(null, uniqueSuffix + file.originalname)
    }
  })
// filter
 const fileFilter = (req, file, cb) => {
     //reject file
     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
         cb(null, true)
     } else {
         cb(null, false)
     }
 }

//upload limit
const upload = multer({ 
    storage: storage,
     limits: {
         fileSize: 1024 * 1024 * 5
     },
     fileFilter: fileFilter
})

const Product = require('../models/product')

router.get('/', Product_controller.product_get_all)

router.post('/',checkAuth, upload.single('productImage') ,Product_controller.product_create_new_product);

router.get('/:productID', checkAuth, Product_controller.product_get_product);

router.patch('/:productID', checkAuth, Product_controller.product_update_product);

router.delete('/:productID', checkAuth, Product_controller.product_delete_product);

module.exports = router;