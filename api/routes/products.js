const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const multer = require ('multer');

//import model
const Product = require('../models/product')

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



router.get('/',(req , res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', upload.single('productImage'),(req ,res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        res.status(201).json({
            message: 'product added',
            Createdproduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:productID',(req , res , next ) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log('from database',doc);
        if (doc) {
            res.status(200).json({
                product: doc
            });
        } else {
            res.status(404).json({
                message: 'No Valid ID'
            })
        }
    })
    .catch(err => {
        console.log(err);
            res.status(200).json({
                error: err
            });
    })
});

router.patch('/:productID',(req , res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for ( const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne(
        {_id: id},
        {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.delete('/:productID',(req , res, next) => {
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            result: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err
        });

    })
});

module.exports = router;