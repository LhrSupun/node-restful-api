const express = require('express');
const router = express.Router();

router.get('/',(req , res, next) => {
    res.status(200).json({
        message: 'GET working products'
    });
});

router.post('/',(req , res, next) => {
    const product = {
        name: req.body.name
    }
    res.status(201).json({
        message: 'POST working products',
        product: product
    });
});

router.get('/:productID',(req , res , next ) => {
    const id = req.params.productID;
    if ( id === 'special') {
        res.status(200).json({
            message: 'Special Property',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed some id:}',
        });
    }

})

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