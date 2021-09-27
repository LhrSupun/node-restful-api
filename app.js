const express = require('express');
const morgan = require('morgan')
const app = express();
const bodyParser = require ('body-parser');

//logging
app.use(morgan('dev'));
//body parse
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

//middleware created by me
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

//error handleing
app.use((req, res , next) =>{
    const error = Error('Not Found');
    error.status = 404;
    next(error);
});

//capture error object
app.use((error ,req ,res , next) => {
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;