const express = require("express");
const { initialData } = require("../../controllers/admin/initialData");
const { validateSignin, isAuthValidated } = require("../../validators/auth");

const router = express.Router();
router.get("/admin/initialdata", initialData);

module.exports = router;
