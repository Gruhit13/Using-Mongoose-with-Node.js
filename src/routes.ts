import { Router } from 'express'
import upload from './helper/image-upload.helper'
import { productModel, cartModel } from './models/productModel'
import {ProductDto} from './dto/product.dto';
import { Validator } from './validate';

const validate = new Validator()

const router = Router()

//  Create new products in product collection
router.post('/api/create', upload.single('image'), validate.valiadte(ProductDto), async (req, res) => {

    const product = req.dto as ProductDto
    
    const record = await productModel.create({
        name: product.name,
        desc: product.desc,
        quantity: product.quantity,
        price: product.price,
        image: product.image
    })

    if(record){
        res.status(201).json({
            "status": true,
            "message": "Product Created"
        })
    }else{
        res.json({
            "status": false,
            "message": "Failed to create model"
        })
    }
})

//  Get all products from product collection
router.get("/api/get-products", async (req, res) => {
    const products = await productModel.find({ })

    if(products.length > 0){
        res.status(200).json(products)
    }else{
        res.status(404).json({
            'status': false,
            'message': 'No Product Found'
        })
    }
})

router.get("/api/get-cart-products", async (req, res) => {
    const products = await cartModel.find({})

    if(products.length > 0){
        res.status(200).json(products)
    }else{
        res.status(404).json({
            "status": false,
            "message": "No item added in cart"
        })
    }
})

//  Get all products from cart collection.
router.post("/api/add-to-cart", async (req, res) => {
    const data = req.body
    //   find the product
    const response1 = await cartModel.findOne({
        name: data.name
    })

    if(response1){
        response1.quantity += data.quantity
        await response1.save()
    }else{
        const newCartProduct = await cartModel.create({
            name: data.name,
            desc: data.desc,
            price: data.price,
            quantity: data.quantity,
            image: data.image
        })
    }

    //  update the quantity from products
    const product = await productModel.findOne({ _id: data._id })
    product.quantity -= data.quantity;
    await product.save()

    res.status(200).json({ 
        'status': true,
        'message': 'Item added'
    })
})

//  Update item to cart collection and product collection
router.post('/api/update-quantity', async (req, res) => {
    const { productName, oldQuant, newQuant} = req.body

    const product = await productModel.findOne({
        name: productName
    })

    const totalQuantity = oldQuant + product.quantity

    if(newQuant < totalQuantity){
        const cart = await cartModel.findOne({
            name: productName,
            quantity: oldQuant
        })

        cart.quantity = newQuant

        product.quantity = totalQuantity - newQuant

        await cart.save()
        await product.save()

        res.status(200).json({
            'status': true,
            'message': 'Quantity changed'
        })
    }else{
        res.status(304).json({
            'status': false,
            'message': 'Not sufficent Product'
        })
    }  
})

export default router