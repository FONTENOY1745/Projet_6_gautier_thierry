const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
//Création de la constante Sauce

const auth = require("../middleware/auth");
// Middleware (Middleware = fonction qui permet de se placer entre deux couches logiciels)
// Middleware pour authentifier les pages de l'application

const multer = require("../middleware/multer-config");
// Middleware qui écrit la destination et le nom des images

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);

module.exports = router;
