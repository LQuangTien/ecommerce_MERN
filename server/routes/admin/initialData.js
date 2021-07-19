const express = require("express");
const { initialData } = require("../../controllers/admin/initialData");
const { isAdmin, requireSignin } = require("../../middlewares");

const router = express.Router();
router.get("/admin/initialdata", requireSignin, isAdmin, initialData);

module.exports = router;
