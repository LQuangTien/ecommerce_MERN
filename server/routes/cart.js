const express = require("express");
const router = express.Router();
const { addItem } = require("../controllers/cart");
const { requireSignin } = require("../middlewares");
router.post("/user/cart/add", requireSignin, addItem);

module.exports = router;
