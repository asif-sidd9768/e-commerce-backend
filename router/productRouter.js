const { getAllProducts, addProduct, getProduct } = require("../controller/productController")

const productRouter = require("express").Router()

productRouter.route('/all-products').get(getAllProducts)
productRouter.route('/add-product').post(addProduct)
productRouter.route('/get-product').post(getProduct)

module.exports = productRouter