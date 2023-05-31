const Product = require("../models/Product")
const User = require("../models/User")

const addProductToWishlist = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate("orders")
    .populate({
      path: 'wishlist',
      populate: {
        path: 'product',
        model: 'Product'
      }
    })
    .populate("wishlist")
    .populate("browsedItems")
    const foundProduct = await Product.findById(req.body.id)
    foundUser.wishlist = [...foundUser.wishlist, foundProduct]
    await foundUser.save()
    res.status(200).send(foundUser)
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

const deleteProductFromWishlist = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate("orders")
    .populate({
      path: 'wishlist',
      populate: {
        path: 'product',
        model: 'Product'
      }
    })
    .populate("wishlist")
    .populate("browsedItems")
    foundUser.wishlist = foundUser.wishlist.filter(({id}) => id !== req.params.itemId)
    await foundUser.save()
    res.send(foundUser)
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  addProductToWishlist, 
  deleteProductFromWishlist
}