import { Router } from "express";
import multer from "multer";

import { generarGrafo, tspVecinoCercano } from "../utilidades/tsp.js"

const enrutador = Router();
const almacenamiento = multer.memoryStorage();
const subida = multer({
    storage: almacenamiento
})

/**
 * Endpoint que recibe un archivo JSON y calcula la mejor ruta 
 * con base al problema TSP, aplicado a ciudades.
 */
enrutador.post("/calcular_ruta", subida.single("archivo"), function(req, res, next){
    const archivo = req.file;
    try{
        if(archivo.mimetype !== "application/json") 
            throw new Error("Tipo de archivo invalido. Debe ser de tipo JSON.");

        const buffer = archivo.buffer;
        const { ciudades } = JSON.parse(buffer.toString());
        const grafoCiudades = generarGrafo(ciudades);
        const ruta = tspVecinoCercano(grafoCiudades);
        const ciudadesResultantes = ruta.map(r => {
            //TODO: Optimizar para reducir la cantidad de ciclos.
            const ciudad = ciudades.find(c => c.nombre === r.llave);
            return {
                nombre: ciudad.nombre,
                latitud: ciudad.latitud,
                longitud: ciudad.longitud
            }
        });

        res.status(200).json({
            code: 200,
            results: ciudadesResultantes
        });
    }catch(error){
        next(error)
    }
});

export default enrutador;