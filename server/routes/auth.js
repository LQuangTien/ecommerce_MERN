const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { requireSignin } = require("../middlewares");
const router = express.Router();
const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../validators/auth");
router.post("/signin", validateSignin, isAuthValidated, signin);
router.post("/signup", validateSignup, isAuthValidated, signup);
router.post("/signout", requireSignin, signout);
// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });
module.exports = router;
