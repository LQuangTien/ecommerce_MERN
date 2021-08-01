const express = require("express");
const { add, get, getById } = require("../controllers/order");
const router = express.Router();
const { requireSignin } = require("../middlewares");

router.get("/user/order/:_id", requireSignin, getById);
router.get("/user/orders", requireSignin, get);
router.post("/user/order/add", requireSignin, add);

module.exports = router;
