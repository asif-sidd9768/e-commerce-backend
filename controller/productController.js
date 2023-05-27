const Product = require('../models/Product')

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(200).send(products)
}

const addProduct = async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured || false,
    sale: req.body.sale || {onSale: false, salePrice: null},
    stockQuantity: req.body.stockQuantity,
  })
  const savedProduct = await product.save()
  res.send(savedProduct)
}

const getProduct = async (req, res) => {
  const product = await Product.findById(req.body.id)
  res.send(product)
}

module.exports = {
  getAllProducts,
  addProduct,
  getProduct
}