const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/register", userController.getRegister)
router.post("/register", userController.postRegister)
router.get("/login", userController.getLogin)
router.post("/login", userController.postLogin)
// Déconnexion par un formulaire (POST) : un simple lien ou une image d'un autre site ne peut pas la déclencher
router.post("/logout", userController.postLogout)

module.exports = router;