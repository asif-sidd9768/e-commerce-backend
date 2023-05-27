const mongoose = require("mongoose")
const Schema = mongoose.Schema

const addressSchema = new Schema({
  name: {type: String, require:true},
  email: {type: String, require:true},
  mobile: {type: String, require: true},
  line: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
})

addressSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Address", addressSchema)