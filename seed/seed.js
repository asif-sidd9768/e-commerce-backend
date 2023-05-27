require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const {faker} = require("@faker-js/faker")
const userRouter = require("../router/userRouter")
const productRouter = require("../router/productRouter")
const PRODUCTS_DATA = require("./db")
const Product = require("../models/Product")
const app = express()

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('successfully connected to DB')
}).catch((error) => {
  console.log('failed to connect to db== ', error)
})

const addProductsToDB = async () => {
  PRODUCTS_DATA.map(async productData => {
    const product = new Product({
      title: productData.title,
      price: productData.price*55,
      description: productData.description,
      category: productData.category,
      image: productData.image,
      rating: productData.rating,
      isFeatured: productData.isFeatured || false,
      sale: productData.sale || {onSale: false, salePrice: null},
      stockQuantity: productData.stockQuantity,
    })
    await product.save()
    console.log(product)
  })
}

addProductsToDB()