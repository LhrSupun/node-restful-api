const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

//import model
const Product = require('../model/product')

router.get('/',(req , res, next) => {
    res.status(200).json({
        message: 'GET working products'
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
            product: result
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
    .exec()
    .then(doc => {
        console.log('from database',doc);
        res.status(200).json({
            error: doc
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.patch('/:productID',(req , res, next) => {
    res.status(200).json({
        message: 'PATCH updated products'
    });
});

router.delete('/:productID',(req , res, next) => {
    res.status(200).json({
        message: 'DELETE working products'
    });
});

module.exports = router;