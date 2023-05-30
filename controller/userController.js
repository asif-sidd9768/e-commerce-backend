const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
const Address = require("../models/Address")

const createUser = async (req, res) => {
  const {email, password, name} = req.body

  const isUserExist = await User.findOne({email: email})
  console.log('email === ',email)
  if(isUserExist){
    return res.status(409).send("User already exists")
  }

  try{
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      email, 
      name,
      passwordHash
    })
    await user.save()
    const userToken = {
      email: user.email,
      id:user._id
    }
  
    const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: "3 days"})
    res.status(200).send({token, user})
  }catch(error){
    res.status(500).send(error)
  }
}

// const registerUser = async (req, res) => {
//   const { name, email, password, confirmPassword } = req.body
  
// }

const loginUser = async (req, res) => {
  const {email, password} = req.body

  const user = await User.findOne({email}).populate({
    path: 'cart',
    populate: {
      path: 'product',
      model: 'Product'
    }
  }).populate({
    path: 'orders',
    model: 'Order',
    populate: {
      path: 'products.product',
      model: 'Product'
    }
  })
  .populate("addresses")
  .populate("wishlist")
  .populate("browsedItems")
  const correctPwd = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if(!(user && correctPwd)){
    return res.status(404).json({
      message:"Invalid email or password."
    })
  }

  const userToken = {
    email: user.email,
    id:user._id
  }

  const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: "3 days"})
  res.status(200).send({token, user})
}

const checkToken = async (req, res) => {
  const {token} = req.body
  try {
    // const decoded = jwt.verify(token, process.env.SECRET)
    // console.log(decoded)
    res.send(req.user)
  }catch(error){
    res.send(error)
  }
}

const addProductToCart = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'products.product',
        model: 'Product'
      }
    })
    .populate("addresses")
    .populate("wishlist")
    .populate("browsedItems")
    const foundProd = await Product.findById(req.body.id)
    if(foundProd.stockQuantity < 1){
      return res.status(409).send("Out of Stock")
    }
    const cart = new Cart({
      product:foundProd, quantity: 1
    })
    foundUser.cart = [...foundUser.cart, cart]
    console.log(foundUser)
    await cart.save()
    await foundUser.save()
    res.status(200).send(cart)
  }catch(error){
    console.log(error)
    res.send(error)
  }
}

const updateCartItem = async (req, res) => {
  try {
    const updateAction = req.body.quantityAction
    const foundCartItem = await Cart.findById(req.params.itemId).populate("product")

    foundCartItem.quantity = updateAction === "increase" ? foundCartItem.quantity+1 : foundCartItem.quantity - 1
    if(foundCartItem.quantity > foundCartItem.product.stockQuantity){
      return res.status(409).json({message: "Stock limit exceeded"})
    }
    await foundCartItem.save()
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'products.product',
        model: 'Product'
      }
    })
    .populate("addresses")
    .populate("wishlist")
    .populate("browsedItems")
    res.send(foundCartItem)
  }catch(error){
    res.send(error)
  }
}

const deleteCartProduct = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id)
    console.log('inside delete')
    console.log(req.params.itemId)
    const cart = await Cart.findByIdAndDelete(req.params.itemId)
    foundUser.cart = foundUser.cart.filter(({id}) => id !== req.params.itemId)
    await foundUser.save()
    res.send(foundUser)
  }catch(error){
    res.send(error)
  }
}

const addAddress = async (req, res) => {
  try {
    const address = new Address(req.body)
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'products.product',
        model: 'Product'
      }
    })
    .populate("addresses")
    .populate("wishlist")
    .populate("browsedItems")
    foundUser.addresses = [...foundUser.addresses, address]
    await address.save()
    await foundUser.save()
    console.log(req.user)
    res.status(200).send({user:foundUser, token:req.user.token})
  }catch(error){
    res.send(error)
  }
}

const deleteAddress = async (req, res) => {
  try{
    const foundUser = await User.findById(req.user.id).populate({
      path: 'cart',
      populate: {
        path: 'product',
        model: 'Product'
      }
    }).populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'products.product',
        model: 'Product'
      }
    })
    .populate("addresses")
    .populate("wishlist")
    .populate("browsedItems")
    await Address.findByIdAndDelete(req.params.addressId)
    foundUser.addresses = foundUser.addresses.filter(({id}) => id !== req.params.addressId)
    await foundUser.save()
    res.status(200).send({user:foundUser, token:req.user.token})
  }catch(error){
    res.status(500).send(error)
  }
}

module.exports = {
  createUser,
  loginUser,
  checkToken,
  addProductToCart,
  updateCartItem,
  deleteCartProduct,
  addAddress,
  deleteAddress
}