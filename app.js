// const express est la fonction (le code à exécuter, ex: une recette de cuisine)
const express = require("express")
const userRoutes = require("./src/Routes/userRoutes")
const mainRoutes = require("./src/Routes/mainRoutes")
const bookRoutes = require("./src/Routes/bookRoutes")

// Appel de méthode : router.méthode("Route", Middleware(s), Route handler)
// Exemple : router.get("/home", authguard, homeController)



const session = require("express-session")

// express() est l’appel de la fonction (const) express, qui renvoie un objet (ici, l’instance app)
// express() = exécuter la recette (const) express
// app = le plat préparé, le résultat
const app = express();

// Réglages : variables d'environnement chez l'hébergeur, valeurs locales sinon
const PORT = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET || 'secretyolo-local'

app.set('views', './src/views')
// Twig échappe le HTML des variables ({{ book.title }}) : un titre ne peut pas injecter de code dans la page
app.set('twig options', { autoescape: true })
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Cookie invisible pour JavaScript et non envoyé depuis un autre site
    cookie: { httpOnly: true, sameSite: 'lax' }
}))

app.use(userRoutes)
app.use(mainRoutes)
app.use(bookRoutes)

// Aucune route n'a répondu : page 404 (le menu s'adapte si l'utilisateur est connecté)
app.use((req, res) => {
    res.status(404).render("pages/404.twig", { user: req.session.user })
})

// app.listen est une méthode clé d’Express qui sert à démarrer un serveur HTTP, donc importée avec express
app.listen(PORT, ()=>{
    console.log(`Écoute sur le port ${PORT}`);
})