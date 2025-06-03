const express = require("express")
const userRoutes = require("./src/Routes/userRoutes")

const app = express();
app.set('views', './src/views')
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))

app.use(userRoutes)
app.listen(3000, ()=>{
    console.log("Écoute sur le port 3000");
})