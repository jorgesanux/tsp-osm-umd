import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Joi from "joi";

import enrutadorApi from "./rutas/api.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT  = process.env.port || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../publico")));

app.use("/api", enrutadorApi);

app.use(function(error, req, res, next){
    let codigo = error instanceof Joi.ValidationError 
        ? 400 
        : 500;

    res.status(codigo).json({
        code: codigo,
        message: error.message
    })
});

app.listen(PORT, function(){
    console.log("Servidor escuchando en el puerto " + PORT);
});;