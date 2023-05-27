const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Product = require('./Product')
const Address = require('./Address')
const Cart = require('./Cart')
const Order = require('./Order')

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  passwordHash: {type: String, required: true},
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    }
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  browsedItems: [
    {
      category: {type: String, required: true},
      timesOpened: {type: Number, required: true}
    }
  ],
  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Address'
    }
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model("User", userSchema)