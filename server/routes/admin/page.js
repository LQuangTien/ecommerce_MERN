const express = require("express");
const router = express.Router();
const { create } = require("../../controllers/admin/page");
const { upload, requireSignin, isAdmin } = require("../../middlewares");

router.post(
  "/page/create",
  upload.fields([{ name: "banners" }, { name: "products" }]),
  requireSignin,
  isAdmin,
  create
);

module.exports = router;
