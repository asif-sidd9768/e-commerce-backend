const userRouter = require("express").Router()
const { addProductToBrowsed } = require("../controller/browserItemsController")
const { createUser, loginUser, checkToken, addProductToCart, updateCartItem, addAddress, deleteCartProduct, deleteAddress, editAddress } = require("../controller/userController")
const { addProductToWishlist, deleteProductFromWishlist } = require("../controller/wishlistController")
const { authenticateUser } = require("../middleware/authenticate")

userRouter.route("/register").post(createUser)
userRouter.route("/login").post(loginUser)
userRouter.post('/:userId/cart', authenticateUser, addProductToCart)
userRouter.post('/:userId/cart/:itemId', authenticateUser, updateCartItem)
userRouter.post("/token-check", authenticateUser, checkToken)
userRouter.post("/:userId/address", authenticateUser, addAddress)
userRouter.post("/:userId/address/:addressId/edit", authenticateUser, editAddress)
userRouter.post("/:userId/address/:addressId/delete", authenticateUser, deleteAddress)
userRouter.post('/:userId/cart/:itemId/delete', authenticateUser, deleteCartProduct)
userRouter.post('/:userId/wishlist/:itemId', authenticateUser, addProductToWishlist)
userRouter.post('/:userId/wishlist/:itemId/delete', authenticateUser, deleteProductFromWishlist)
userRouter.post('/:userId/browsed-item/:itemId', authenticateUser, addProductToBrowsed)
module.exports = userRouter