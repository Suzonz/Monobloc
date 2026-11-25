const { PrismaClient } = require("../../generated/prisma")
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension")
const bcrypt = require("bcrypt")


const prisma = new PrismaClient({}).$extends(hashPasswordExtension)

const MAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Les erreurs du formulaire d'inscription, champ par champ (objet vide si tout va bien). */
function checkRegister(body) {
    const error = {}
    if (!body.lastName) error.lastName = "Le nom est obligatoire"
    if (!body.firstName) error.firstName = "Le prénom est obligatoire"
    if (!MAIL_FORMAT.test(body.mail)) error.mail = "L'adresse email n'est pas valide"
    if (!body.password || body.password.length < 8) error.password = "Le mot de passe doit faire au moins 8 caractères"
    else if (body.password !== body.confirmPassword) error.confirmPassword = "Les mots de passe ne sont pas identiques"
    return error
}

exports.getRegister = async (req, res) => {
    res.render('pages/register.twig')
}

exports.postRegister = async (req, res) => {
    const values = {
        lastName: (req.body.lastName || "").trim(),
        firstName: (req.body.firstName || "").trim(),
        mail: (req.body.mail || "").trim().toLowerCase(),
        password: req.body.password || "",
        confirmPassword: req.body.confirmPassword || ""
    }
    // On renvoie les champs déjà remplis, jamais les mots de passe
    const refill = { lastName: values.lastName, firstName: values.firstName, mail: values.mail }
    try {
        const error = checkRegister(values)
        if (Object.keys(error).length) throw error

        await prisma.user.create({
            data: {
                firstName: values.firstName,
                lastName: values.lastName,
                mail: values.mail,
                password: values.password
            }
        })
        res.redirect("/login")
    }
    catch (error) {
        // P2002 : l'adresse email existe déjà (champ unique)
        if (error.code === "P2002") error = { mail: "Cette adresse email est déjà utilisée" }
        else if (error instanceof Error) {
            console.log(error)
            error = { global: "L'inscription n'a pas pu être enregistrée" }
        }
        res.render('pages/register.twig', { error, values: refill })
    }
}

exports.getLogin = async (req, res) => {
    res.render('pages/login.twig')
}

exports.postLogin = async (req, res) => {
    const mail = (req.body.mail || "").trim().toLowerCase()
    try {
        const user = mail && await prisma.user.findUnique({
            where: {
                mail
            }
        })
        if (user) {
            if (await bcrypt.compare(req.body.password || "", user.password)) {
                // Nouvel identifiant de session à la connexion, et seulement les infos utiles
                // (le mot de passe, même chiffré, ne va pas dans la session)
                req.session.regenerate((err) => {
                    if (err) return res.render("pages/login.twig", { error: { mail: "Connexion impossible, réessaie" } })
                    req.session.user = { id: user.id, firstName: user.firstName, lastName: user.lastName, mail: user.mail }
                    res.redirect("/")
                })
                return
            }
            else throw { password: "Mot de passe incorrect" }
        }
        else throw { mail: "Email incorrect" }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error)
            error = { mail: "Connexion impossible, réessaie" }
        }
        res.render("pages/login.twig", { error, values: { mail } })
    }
}

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
}
