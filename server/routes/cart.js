const express = require("express");
const router = express.Router();
const { addItem, getCart } = require("../controllers/cart");
const { requireSignin } = require("../middlewares");
router.post("/user/cart/add", requireSignin, addItem);
router.get("/user/cart", requireSignin, getCart);

module.exports = router;
