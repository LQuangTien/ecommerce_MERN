const express = require("express");
const { signup, signin, signout } = require("../../controllers/admin/auth");
const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../../validators/auth");
const { requireSignin } = require("../../middlewares");

const router = express.Router();
router.post("/admin/signin", validateSignin, isAuthValidated, signin);
router.post("/admin/signup", validateSignup, isAuthValidated, signup);
router.post("/admin/signout", requireSignin, signout);

module.exports = router;
