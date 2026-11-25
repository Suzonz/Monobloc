const express = require("express")
const router = express.Router()
const mainController = require("../controllers/mainController");
const authguard = require("../services/extensions/authguard");


// Appel de méthode : router.méthode("Route", Middleware(s), Route handler)
// Exemple : router.get("/home", authguard, homeController)
router.get("/", authguard, mainController.getHome)

module.exports = router;