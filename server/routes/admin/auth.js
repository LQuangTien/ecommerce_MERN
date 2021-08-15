const express = require("express");

const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../../validators/auth");
const { requireSignin } = require("../../middlewares");
const { signup } = require("../../controllers/admin/auth");
const { signin, signout } = require("../../controllers/auth");

const router = express.Router();

router.post("/admin/signout", requireSignin, signout);
router.post("/admin/signin", validateSignin, isAuthValidated, signin);
router.post("/admin/signup", validateSignup, isAuthValidated, signup);

module.exports = router;
