const express = require("express");

const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../validators/auth");
const { requireSignin } = require("../middlewares");
const { signup, signin, signout, changePassword, forgetPassword } = require("../controllers/auth");

const router = express.Router();

router.post("/signin", validateSignin, isAuthValidated, signin);
router.post("/signup", validateSignup, isAuthValidated, signup);
router.post("/signout", requireSignin, signout);
router.get("/forget-password", requireSignin, forgetPassword);
router.post("/change-password", requireSignin, changePassword);

module.exports = router;
