const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {type: String , required: true},
  price: {type: Number , required: true},
  description: {type: String , required: true},
  category: {type: String , required: true},
  image: {type: String , required: true},
  rating: {
    rate: {type: Number},
    count: {type: Number}
  },
  isFeatured: {type: Boolean , required: true},
  sale: {
    onSale: {type: Boolean},
    salePrice: {type: Number}
  },
  stockQuantity: {type: Number , required: true},
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject?._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Product", productSchema)