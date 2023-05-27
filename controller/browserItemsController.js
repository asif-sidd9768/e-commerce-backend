const Product = require('../models/Product')
const User = require('../models/User')

const addProductToBrowsed = async (req, res) => {
  try{
    const foundUser = await User.findById(req.params.userId).populate("browsedItems")
    if(!foundUser){
      return res.status(404).send("User not found.")
    }
    const foundProduct = await Product.findById(req.params.itemId)
    const foundBrowsedItem = foundUser.browsedItems.find(({category}) => category === foundProduct.category)

    let updatedBrowsedItems
    if(foundBrowsedItem) {
      updatedBrowsedItems = foundUser.browsedItems.map((browsedItem) => browsedItem.category === foundProduct.category ? ({...browsedItem, timesOpened: browsedItem.timesOpened+=1}) : ({...browsedItem}))
    }else {
      updatedBrowsedItems = [...foundUser.browsedItems, {productId: foundProduct.id, category: foundProduct.category, timesOpened: 1}]
    }
    foundUser.browsedItems = [...updatedBrowsedItems]
    await foundUser.save()
    res.send(foundUser?.browsedItems)
  }catch(error){
    console.log(error)
    res.status(500).send(error)
  }
}

module.exports = {
  addProductToBrowsed
}