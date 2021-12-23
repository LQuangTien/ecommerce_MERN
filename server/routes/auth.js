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
router.post("/forget-password", requireSignin, forgetPassword);
router.get("/change-password", changePassword);

module.exports = router;
