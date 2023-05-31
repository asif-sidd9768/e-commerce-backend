const Product = require('../models/Product')

const getAllProducts = async (req, res) => {
  try{
    const products = await Product.find({})
    res.status(200).send(products)
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

const addProduct = async (req, res) => {
  try {
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
  catch(error){
    res.status(500).json({message: error.message})
  }
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