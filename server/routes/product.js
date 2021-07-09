const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const router = express.Router();
const { create, getBySlug } = require("../controllers/product");
const { requireSignin, isAdmin } = require("../middlewares");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post(
  "/product/create",
  requireSignin,
  isAdmin,
  upload.array("productPicture"),
  create
);
router.get("/product/:slug", getBySlug);
module.exports = router;
