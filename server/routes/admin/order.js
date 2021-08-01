const express = require("express");
const router = express.Router();
const { updateOrder, getCustomerOrders } = require("../../controllers/admin/order");
const { requireSignin, isAdmin } = require("../../middlewares");

router.put("/order/update", requireSignin, isAdmin, updateOrder);
router.put("/order/", requireSignin, isAdmin, getCustomerOrders);
module.exports = router;
