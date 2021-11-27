const express = require("express");

const { requireSignin, isAdmin } = require("../middlewares");
const {
  add,
  get,
  getById,
  zaloPayment,
  verifyZaloPayment,
} = require("../controllers/order");

const router = express.Router();

router.get("/user/orders", requireSignin, get);
router.post("/user/order/add", requireSignin, add);
// router.get("/user/order/momoPayment",momoPayment);

router.post("/user/order/zaloPayment", zaloPayment);
// router.post("/user/order/getOrderStatus", getOrderStatus);

router.get("/user/order/:_id", requireSignin, getById);

module.exports = router;
