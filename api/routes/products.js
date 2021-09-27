const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');

//import model
const Product = require('../model/product')

router.get('/',(req , res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs,docs.lengt);
       // if (docs.length >= 0) {
            res.status(200).json(docs);
        // } else {
        //     res.status(404).json({
        //         message: "No data found"
        //     });
        // }
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
        if (doc) {
            res.status(200).json({
                product: doc
            });
        } else {
            res.status(404).json({
                message: 'No Valid ID'
            })
        }
        res.status(200).json({
            product: doc
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
    .catch()
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