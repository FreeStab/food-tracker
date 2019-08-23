const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('./models/product')

router.get('/',(req, res, next) => {
    res.status(200).json({
        message:'Coucou'
    })
})

router.post('/', (req, res, next) => {

    
    console.log(req.body);
    /*
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(result => {
        console.log(result)
    })
    .catch(err => console.log(err));
    */

    res.status(201).json({
        message: 'Produit crée',
        //createdProduct: product
    })
})


module.exports = router