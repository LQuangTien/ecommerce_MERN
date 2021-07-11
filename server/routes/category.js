const express = require("express");
const router = express.Router();
const { create, get, remove, update } = require("../controllers/category");
const { requireSignin, isAdmin } = require("../middlewares");
const shortid = require("shortid");
const multer = require("multer");
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
  "/category/create",
  requireSignin,
  isAdmin,
  upload.single("categoryImage"),
  create
);
router.get("/category/", get);
router.put("/category/update", upload.array("categoryImage"), update);
router.put("/category/delete", remove);

module.exports = router;
