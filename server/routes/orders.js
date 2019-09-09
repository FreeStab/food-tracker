const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

const endPoint = "http://localhost:3000/api/orders"

router.get('/', (req, res, next) => {
    Order.find()
        .select('quantity product _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: `${endPoint}/${doc._id}`
                        }
                    }
                })

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})


router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Order successfully created',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product

                },
                request: {
                    type: 'GET',
                    url: `${endPoint}/${result._id}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });

})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .select('name price _id')
        .exec()
        .then(order => {
            if (order) {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: endPoint
                    }
                })
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: 'POST',
                    url: `${endPoint}/`,
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

})


module.exports = router