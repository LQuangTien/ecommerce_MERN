const express = require("express");

const { requireSignin, isAdmin } = require("../../middlewares");
const { update, getAll } = require("../../controllers/admin/order");

const router = express.Router();

router.put("/order/update", requireSignin, isAdmin, update);
router.put("/order/", requireSignin, isAdmin, getAll);

module.exports = router;
