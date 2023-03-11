import { distanciaEntreCoordenadas } from "./utilidades/calculos.js";
import { Arista, Grafo, Vertice } from "./utilidades/grafo.js";

import datosCiudades from "./datos/ciudades.json" assert { type: 'json'};

const { ciudades } = datosCiudades;
const grafo = new Grafo();
grafo.agregarVertices(
    ciudades.map(ciudad => new Vertice(ciudad.nombre))
);

for (let i = 0; i < ciudades.length; i++) {
    for (let j = 0; j < ciudades.length; j++) {
        //Evita que se agregue a si mismo
        if (ciudades[i].nombre === ciudades[j].nombre) continue;
        const arista = new Arista(
            grafo.obtenerVertice(ciudades[i].nombre),
            grafo.obtenerVertice(ciudades[j].nombre),
            distanciaEntreCoordenadas(
                { lat: ciudades[i].latitud, long: ciudades[i].longitud },
                { lat: ciudades[j].latitud, long: ciudades[j].longitud }
            )
        );
        grafo.agregarArista(arista);
    }
}


// console.log(grafo.vertices, grafo.listaAdyacencia);
grafo.imprimir();