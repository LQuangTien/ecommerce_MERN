const express = require("express");
const router = express.Router();
const { addItem, getCart, removeCartItems } = require("../controllers/cart");
const { requireSignin } = require("../middlewares");
router.post("/user/cart/add", requireSignin, addItem);
router.get("/user/cart", requireSignin, getCart);
router.post("/user/cart/remove", requireSignin, removeCartItems);
module.exports = router;
