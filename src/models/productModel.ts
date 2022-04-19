import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    }
})

const productModel = mongoose.model('Product', ProductSchema)
const cartModel = mongoose.model('Cart', ProductSchema)

export {productModel, cartModel}