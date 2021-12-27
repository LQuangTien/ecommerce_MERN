const express = require("express");

const { isAdmin, requireSignin } = require("../../middlewares");
const {
  initialData,
  totalOrderPricePerMonthByYear,
} = require("../../controllers/admin/initialData");

const router = express.Router();
//requireSignin, isAdmin,
router.get("/admin/initialdata", initialData);
router.get(
  "/admin/totalOrderPricePerMonthByYear",
  totalOrderPricePerMonthByYear
);

module.exports = router;
