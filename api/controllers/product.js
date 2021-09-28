const mongoose = require ('mongoose');

const Product = require('../models/product')

exports.product_get_all = (req , res, next) => {
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
}

exports.product_create_new_product = (req ,res, next) => {
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
    
}

exports.product_get_product = (req , res , next ) => {
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
}

exports.product_update_product = (req , res, next) => {
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
}

exports.product_delete_product = (req , res, next) => {
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
}