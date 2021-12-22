const express = require("express");

const { isAdmin, requireSignin } = require("../../middlewares");
const { initialData } = require("../../controllers/admin/initialData");

const router = express.Router();
//requireSignin, isAdmin,
router.get("/admin/initialdata",  initialData);

module.exports = router;
