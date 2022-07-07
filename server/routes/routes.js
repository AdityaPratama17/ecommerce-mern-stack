// const express = require('express')
import express from "express"
const router = express.Router()
import { verifyToken } from "../middleware/VerifyToken.js"
import { fetchAllProduct, fetchProductById, createProduct, updateProduct, deleteProduct } from "../controllers/ProductController.js"
import { getUsers, Register, Login, refreshToken, Logout } from "../controllers/AuthController.js"
import { getCart, getTotalHarga, addCart, editCart, deleteCart } from "../controllers/CartController.js"
import { checkout, getOrder, kirimOrder, tolakOrder } from "../controllers/OrderController.js"


// product
router.get("/product/", verifyToken, fetchAllProduct)
router.get("/product/:id", verifyToken, fetchProductById)
router.post("/product/", verifyToken, createProduct)
router.patch("/product/:id", verifyToken, updateProduct)
router.delete("/product/:id", verifyToken, deleteProduct)

// AUTH
router.get("/user/", verifyToken, getUsers)
router.post("/register/", Register)
router.post("/login/", Login)
router.get("/token/", refreshToken)
router.delete("/logout/", Logout)

// Cart
router.get("/cart/:id", verifyToken, getCart)
router.get("/cart/total-harga/:id", verifyToken, getTotalHarga)
router.post("/cart/", verifyToken, addCart)
router.patch("/cart/:id", verifyToken, editCart)
router.delete("/cart/:id", verifyToken, deleteCart)

// Order
router.get("/checkout/:id", verifyToken, checkout)
router.get("/order/", verifyToken, getOrder)
router.get("/order/kirim/:id_order/:id_product", verifyToken, kirimOrder)
router.get("/order/tolak/:id", verifyToken, tolakOrder)


// module.exports = router
export default router