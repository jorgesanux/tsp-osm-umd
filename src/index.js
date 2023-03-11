import Decimal from "decimal.js";

import { aKilometros, distanciaEntreCoordenadas, hipotenusa } from "./utilidades/calculos.js";
import { Arista, Grafo, Vertice } from "./utilidades/grafo.js";

import datosCiudades from "./datos/ciudades.json" assert { type: 'json'};

const { ciudades } = datosCiudades;

// for(const ciudad of ciudades){
//     console.log(ciudad.nombre,ciudad.altura/ciudad.demora);
// }

const grafo = new Grafo();
grafo.agregarVertices(
    ciudades.map(ciudad => new Vertice(ciudad.nombre))
);

for(const ciudadOrigen of ciudades){
    for(const ciudadDestino of ciudades){
        //Evita que se agregue a si mismo
        if (ciudadOrigen.nombre === ciudadDestino.nombre) continue;

        //
        const diferenciaAltura = aKilometros(Decimal.sub(ciudadOrigen.altura, ciudadDestino.altura).abs());
        const distanciaHaversine = distanciaEntreCoordenadas(
            { lat: ciudadOrigen.latitud, long: ciudadOrigen.longitud },
            { lat: ciudadDestino.latitud, long: ciudadDestino.longitud }
        );
        const distanciaReal = hipotenusa(distanciaHaversine, diferenciaAltura);

        // console.log(ciudadOrigen, ciudadDestino, diferenciaAltura.toNumber());
        console.log(distanciaHaversine, distanciaReal, diferenciaAltura, distanciaReal - distanciaHaversine);

        const arista = new Arista(
            grafo.obtenerVertice(ciudadOrigen.nombre),
            grafo.obtenerVertice(ciudadDestino.nombre),
            distanciaReal
        );
        grafo.agregarArista(arista);
    }
}

// console.log(grafo.vertices, grafo.listaAdyacencia);
grafo.imprimir();