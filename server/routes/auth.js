const express = require("express");
const { signup, signin, requireSignin } = require("../controllers/auth");
const router = express.Router();
const {
  validateSignin,
  validateSignup,
  isAuthValidated,
} = require("../validators/auth");
router.post("/signin", validateSignin, isAuthValidated, signin);
router.post("/signup", validateSignup, isAuthValidated, signup);
// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });
module.exports = router;
