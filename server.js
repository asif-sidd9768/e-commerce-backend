require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const {faker} = require("@faker-js/faker")
const userRouter = require("./router/userRouter")
const productRouter = require("./router/productRouter")
const orderRouter = require("./router/orderRouter")
const app = express()

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('successfully connected to DB')
}).catch((error) => {
  console.log('failed to connect to db== ', error)
})

app.use(cors())
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/checkout", orderRouter)

app.get("/", async (req, res) => {
  const prod = {
    name: faker.commerce.productName(),
        price: faker.commerce.price(),
        image: faker.image.url(),
        description: faker.lorem.sentence(),
        category: faker.commerce.department(),
        countInStock: faker.number.int({min:1, max: 20}),
  }
  res.send(prod)
})

app.listen(process.env.PORT, () => {
  console.log(`listening... on ${process.env.PORT}`)
})