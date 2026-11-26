const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})

exports.getHome = async (req, res) => {
    try {
        // Seulement les livres de l'utilisateur connecté, du plus récent au plus ancien
        const books = await prisma.book.findMany({
            where: {
                id_user: req.session.user.id
            },
            orderBy: {
                id: "desc"
            }
        })
        res.render("pages/home.twig", { user: req.session.user, books })
    }
    catch (error) {
        console.log(error)
        res.render("pages/home.twig", { user: req.session.user, books: [], error: "La collection n'a pas pu être chargée." })
    }
}
