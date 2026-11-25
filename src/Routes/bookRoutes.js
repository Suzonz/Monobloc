const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController");
const authguard = require("../services/extensions/authguard");

router.get("/addBook", authguard, bookController.getAddBook)
router.post("/addBook", authguard, bookController.postAddBook)

// Suppression par un formulaire (POST), pas par un simple lien
router.post("/deleteBook/:id", authguard, bookController.deleteBook)

router.get("/updateBook/:id", authguard, bookController.getUpdateBook)
router.post("/updateBook/:id", authguard, bookController.postUpdateBook)

module.exports = router;