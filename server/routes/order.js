const express = require("express");

const { requireSignin } = require("../middlewares");
const { add, get, getById, test } = require("../controllers/order");

const router = express.Router();

router.get("/user/orders", requireSignin, get);
router.get("/user/order/:_id", requireSignin, getById);
router.post("/user/order/add", requireSignin, add);

module.exports = router;
