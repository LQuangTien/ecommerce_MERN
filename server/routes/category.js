const multer = require("multer");
const express = require("express");
const shortid = require("shortid");

const { requireSignin, isAdmin } = require("../middlewares");
const { get, create, update, remove } = require("../controllers/category");

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

router.get("/category/", get);
router.post(
  "/category/create",
  requireSignin,
  isAdmin,
  upload.single("categoryImage"),
  create
);
router.put("/category/delete", remove);
router.put("/category/update", upload.array("categoryImage"), update);

module.exports = router;
