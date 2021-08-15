const multer = require("multer");
const express = require("express");
const shortid = require("shortid");

const { requireSignin, isAdmin } = require("../middlewares");
const { create, getBySlug, getById } = require("../controllers/product");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/product/:id", getById);
router.get("/products/:slug", getBySlug);
router.post(
  "/product/create",
  requireSignin,
  isAdmin,
  upload.array("productPicture"),
  create
);
module.exports = router;
