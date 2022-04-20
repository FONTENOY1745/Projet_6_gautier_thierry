const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
// Prévention des attaques par la force brute
const userCtrl = require("../controllers/user");

const passLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  // Fixation du temps défini pour tester l'application = 2 minutes
  max: 3,
  // Fixation à trois essais maximum
});

router.post("/signup", userCtrl.signup);
router.post("/login", passLimiter, userCtrl.login);

module.exports = router;
