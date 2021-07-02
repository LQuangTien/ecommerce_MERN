const express = require("express");
const router = express.Router();
const { create, get } = require("../controllers/category");
const { requireSignin, isAdmin } = require("../middlewares");
router.post("/category/create", requireSignin, isAdmin, create);
router.get("/category/", get);

module.exports = router;
