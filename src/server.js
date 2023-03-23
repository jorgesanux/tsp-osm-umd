import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { generarGrafo, tspVecinoCercano } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT  = process.env.port || 3000;
const app = express();
const almacenamiento = multer.memoryStorage();
const subida = multer({
    storage: almacenamiento
})

app.use(express.static(path.join(__dirname, "../publico")));

app.post("/subir_archivo", subida.single("archivo"), function(req, res, next){
    const archivo = req.file;
    try{
        if(archivo.mimetype !== "application/json") 
            throw new Error("Tipo de archivo invalido. Debe ser de tipo JSON.");

        const buffer = archivo.buffer;
        const { ciudades } = JSON.parse(buffer.toString());
        const grafoCiudades = generarGrafo(ciudades);
        const ruta = tspVecinoCercano(grafoCiudades);
        res.status(200).json({
            code: 200,
            results: ruta.map(r => {
                const ciudad = ciudades.find(c => c.nombre === r.llave);
                return {
                    nombre: ciudad.nombre,
                    latitud: ciudad.latitud,
                    longitud: ciudad.longitud
                }
            })
        });
    }catch(error){
        next(error)
    }
});

app.get("/", function(req, res, next){
    res.json({});
});

app.use(function(error, req, res, next){
    res.status(500).json({
        code: 500,
        message: error.message
    })
});

app.listen(PORT, function(){
    console.log("Server listening on port " + PORT);
});;