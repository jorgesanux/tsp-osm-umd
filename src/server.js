import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import enrutadorApi from "./rutas/api.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT  = process.env.port || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../publico")));

app.use("/api", enrutadorApi);

app.use(function(error, req, res, next){
    res.status(500).json({
        code: 500,
        message: error.message
    })
});

app.listen(PORT, function(){
    console.log("Servidor escuchando en el puerto " + PORT);
});;