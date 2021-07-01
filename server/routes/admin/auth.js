const express = require("express");
const { signup, signin } = require("../../controllers/admin/auth");
const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../../validators/auth");
const router = express.Router();
router.post("/admin/signin", validateSignin, isAuthValidated, signin);
router.post("/admin/signup", validateSignup, isAuthValidated, signup);

module.exports = router;
