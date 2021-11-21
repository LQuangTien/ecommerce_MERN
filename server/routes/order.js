const express = require("express");

const { requireSignin, isAdmin } = require("../middlewares");
const { add, get, getById,momoPayment } = require("../controllers/order");

const router = express.Router();

router.get("/user/orders", requireSignin, get);
router.post("/user/order/add", requireSignin, add);
// router.get("/user/order/momoPayment",momoPayment);

// router.post("/user/order/payment",payment);
// router.post("/user/order/verifyZaloPayment",VerifyZaloPayment);

router.get("/user/order/:_id", requireSignin, getById);

module.exports = router;
