const express = require("express");
const router = express.Router();
const { create, get } = require("../../controllers/admin/page");
const { upload, requireSignin, isAdmin } = require("../../middlewares");

router.post(
  "/page/create",
  upload.fields([{ name: "banners" }, { name: "products" }]),
  requireSignin,
  isAdmin,
  create
);
router.get("/page/:category/:type", get);
module.exports = router;
