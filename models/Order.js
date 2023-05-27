const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalCost: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingMethod: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentDetail: {
      orderCreationId: String,
      razorpayPaymentId: String,
      razorpayOrderId: String,
      razorpaySignature: String,
    }
})

OrderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Order', OrderSchema)
