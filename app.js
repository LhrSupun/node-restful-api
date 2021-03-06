const express = require('express');
const morgan = require('morgan')
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const path = require ('path')



//DB connect
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@cluster0.wljvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
    }
)


//logging
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin ,X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT,POST, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next()
});

//routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

//middleware created by me
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//error handleing
app.use((req, res , next) =>{
    const error = Error('Not Found');
    error.status = 404;
    next(error);
});

//capture error object
app.use((error ,req ,res , next) => {
    console.log(error)
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message,
        }
    });
});


module.exports = app;