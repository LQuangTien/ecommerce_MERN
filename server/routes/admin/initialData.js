const express = require("express");

const { isAdmin, requireSignin } = require("../../middlewares");
const { initialData } = require("../../controllers/admin/initialData");

const router = express.Router();

router.get("/admin/initialdata", requireSignin, isAdmin, initialData);

module.exports = router;
