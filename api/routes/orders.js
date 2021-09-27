const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) =>{
    res.status(200).json({
        message: 'Orders fetched'
    })
})

router.post('/:orderId',(req, res, next) =>{
    res.status(201).json({
        message: 'Orders created',
        id: req.params.orderId
    })
})

router.get('/:orderId',(req, res, next) =>{
    res.status(200).json({
        message: 'Order fetched',
        id: req.params.orderId
    })
})

router.delete('/:orderId',(req, res, next) =>{
    res.status(200).json({
        message: 'Order deleted'
    })
})

module.exports = router;

