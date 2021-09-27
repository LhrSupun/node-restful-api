const mongoose = require ('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    prce: Number
});

module.exports = mongoose.model('Product', productSchema);
