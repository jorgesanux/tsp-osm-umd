import { Router } from "express";
import multer from "multer";
import Joi from "joi";

import { generarGrafo, tspVecinoCercano } from "../utilidades/tsp.js"

const enrutador = Router();

const almacenamiento = multer.memoryStorage();
const subida = multer({
    storage: almacenamiento
});

// Esquema de validación para el objeto json subido por el usuario/sistema
const esquema = Joi.object({
    ciudades: Joi.array().items(Joi.object({
        nombre: Joi.string().required(),
        altura: Joi.number().positive().required(),
        longitud: Joi.number().required(),
        latitud: Joi.number().required(),
        demora: Joi.number().integer().required()
    }))
});

/**
 * Endpoint que recibe un archivo JSON y calcula la mejor ruta 
 * con base al problema TSP, aplicado a ciudades.
 */
enrutador.post("/calcular_ruta", subida.single("archivo"), async function(req, res, next){
    const archivo = req.file;
    try{
        if(!archivo) throw new Error("Debe enviar un archivo.");
        if(archivo.mimetype !== "application/json") 
            throw new Error("Tipo de archivo invalido. Debe ser de tipo JSON.");

        const buffer = archivo.buffer;
        let datosJSON = JSON.parse(buffer.toString());
        datosJSON = await esquema.validateAsync(datosJSON);

        const { ciudades } = datosJSON;
        const grafoCiudades = generarGrafo(ciudades);
        const ruta = tspVecinoCercano(grafoCiudades);
        const ciudadesResultantes = ruta.map((r, i) => {
            //TODO: Optimizar para reducir la cantidad de ciclos.
            const ciudad = ciudades.find(c => c.nombre === r.llave);
            return {
                posicion: i,
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