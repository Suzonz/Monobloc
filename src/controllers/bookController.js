const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})

/**
 * Le livre demandé, seulement s'il appartient à l'utilisateur connecté
 * (sinon null : on ne peut ni voir, ni modifier, ni supprimer le livre d'un autre)
 */
async function findOwnBook(req) {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) return null
    return prisma.book.findFirst({
        where: {
            id,
            id_user: req.session.user.id
        }
    })
}

/** Titre et auteur du formulaire, sans espaces autour ; une erreur si l'un est vide. */
function readBookForm(req) {
    const title = (req.body.title || "").trim()
    const author = (req.body.author || "").trim()
    const error = (!title || !author) ? "Le titre et l'auteur sont obligatoires." : null
    return { title, author, error }
}

exports.getAddBook = async (req, res) => {
    res.render("pages/addbook.twig", { user: req.session.user })
}

exports.postAddBook = async (req, res) => {
    const { title, author, error } = readBookForm(req)
    if (error) {
        return res.render("pages/addbook.twig", { user: req.session.user, error, values: { title, author } })
    }
    try {
        await prisma.book.create({
            data: {
                title,
                author,
                id_user: req.session.user.id
            }
        })
        res.redirect("/")
    }
    catch (error) {
        console.log(error)
        res.render("pages/addbook.twig", { user: req.session.user, error: "Le livre n'a pas pu être ajouté.", values: { title, author } })
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const book = await findOwnBook(req)
        if (book) {
            await prisma.book.delete({
                where: {
                    id: book.id
                }
            })
        }
        res.redirect("/")
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

exports.getUpdateBook = async (req, res) => {
    try {
        const book = await findOwnBook(req)
        if (!book) return res.redirect("/")

        res.render("pages/addbook.twig", { user: req.session.user, book })
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

exports.postUpdateBook = async (req, res) => {
    try {
        const book = await findOwnBook(req)
        if (!book) return res.redirect("/")

        const { title, author, error } = readBookForm(req)
        if (error) {
            return res.render("pages/addbook.twig", { user: req.session.user, book, error, values: { title, author } })
        }

        await prisma.book.update({
            where: {
                id: book.id
            },
            data: {
                title,
                author
            }
        })
        res.redirect("/")
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
