const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

//import model
const Product = require('../models/product')

router.get('/',(req , res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
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

router.post('/',(req , res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        res.status(201).json({
            message: 'POST working products',
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
        console.log(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:productID',(req , res , next ) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id')
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