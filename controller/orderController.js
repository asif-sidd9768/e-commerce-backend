const Razorpay = require("razorpay")
const uuid = require('uuid');
const short = require('short-uuid');
const Order = require("../models/Order")
const Address = require("../models/Address")
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");


const createOrder = async (req,res) => {
  try{
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const orderAmout = Number(req.body.checkoutData.checkoutTotal).toFixed(2)*100
    const options = {
      amount: orderAmout, // amount in smallest currency unit
      currency: "INR",
      receipt: uuid.v4(),
    }

    // console.log({options}, {order})
    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).json({message: "Internal Server Error"});
    }

    res.send(order)
  }catch(error){
    console.log(error)
    res.status(500).json({message: error.message})
  }
}

const successOrder = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
  } = req.body.checkoutData.checkoutDetails;
    const address = await Address.findById(req.body.checkoutData.orderDetails.shippingAddress.id)
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
    if(!foundUser){
      return res.status(404).json({message:"User not found"})
    }

    const products = req.body.checkoutData.orderDetails.cartItems.map(item => ({
      product: item.product.id,
      quantity: item.quantity
    }));

    const orderData = new Order({
      user: req.user.id,
      products: products,
      totalCost: req.body.checkoutData.orderDetails.checkoutTotal,
      shippingAddress: address,
      paymentMethod: req.body.checkoutData.orderDetails.paymentMethod,
      shippingMethod: req.body.checkoutData.orderDetails.shippingMethod,
      paymentDetail: req.body.checkoutData.checkoutDetails
    })
    foundUser.orders = [...foundUser.orders, orderData]
    foundUser.cart = []
    await orderData.save()
    await foundUser.save()
    const foundOrder = await Order.findById(orderData.id).populate("products.product").populate("shippingAddress")

    foundOrder.products.map(async orderItem => {
      const foundProd = await Product.findById(orderItem.product.id)
      foundProd.stockQuantity = foundProd.stockQuantity - orderItem.quantity
      await foundProd.save()
    })

    res.status(200).send({      
      orderData:foundOrder,
      updatedUser: {user:foundUser, token:req.user.token},
      msg: "successful",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

const codOrder = async (req, res) => {
  try {
    const address = await Address.findById(req.body.checkoutData.orderDetails.shippingAddress.id)
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
    const orderCreationId = `order_${short.generate()}`
    const products = req.body.checkoutData.orderDetails.cartItems.map(item => ({
      product: item.product.id,
      quantity: item.quantity
    }));
    const orderData = new Order({
      user: req.user.id,
      products: products,
      totalCost: req.body.checkoutData.orderDetails.checkoutTotal,
      shippingAddress: address,
      paymentMethod: req.body.checkoutData.orderDetails.paymentMethod,
      shippingMethod: req.body.checkoutData.orderDetails.shippingMethod,
      paymentDetail: {orderCreationId}
    })
    foundUser.orders = [...foundUser.orders, orderData]
    foundUser.cart = []
    await orderData.save()
    await foundUser.save()
    const foundOrder = await Order.findById(orderData.id).populate("products.product").populate("shippingAddress")

    foundOrder.products.map(async orderItem => {
      const foundProd = await Product.findById(orderItem.product.id)
      foundProd.stockQuantity = foundProd.stockQuantity - orderItem.quantity
      await foundProd.save()
    })
    
    res.status(200).send({      
      orderData:foundOrder,
      updatedUser: {user:foundUser, token:req.user.token},
      msg: "successful",
      orderId: orderCreationId,
    });
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  createOrder,
  successOrder,
  codOrder
}