const { PrismaClient } = require("../../generated/prisma")
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension")

const prisma = new PrismaClient({}).$extends(hashPasswordExtension)

exports.getRegister = async (req, res) => {
    res.render('pages/register.twig')
}

exports.postRegister = async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const user = await prisma.user.create({
                data: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    mail: req.body.mail,
                    password: req.body.password
                }
            })
            res.redirect("/login")
        }
        else throw ({ confirmPassword: "Les mots de passe ne sont pas identiques" })
    }
    catch (error) {
        res.render('pages/register.twig', {error})
    }
}

exports.getLogin = async (req, res) => {
    res.render('pages/login.twig')
}