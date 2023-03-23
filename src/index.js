import Decimal from "decimal.js";

import { aKilometros, distanciaEntreCoordenadas, hipotenusa } from "./utilidades/calculos.js";
import { Arista, Grafo, Vertice } from "./utilidades/grafo.js";
import jsonCiudades from "./datos/ciudades.json" assert { type: 'json'};

/**
 * Genera un grafo completo no direccionado a partir de la información
 * de las ciudades.
 * @param {Object[]} datosCiudades 
 * @returns {Grafo};
 */
export function generarGrafo(datosCiudades){
    const grafo = new Grafo();
    grafo.agregarVertices(
        datosCiudades.map(ciudad => new Vertice(ciudad.nombre))
    );

    for(const ciudadOrigen of datosCiudades){
        for(const ciudadDestino of datosCiudades){
            //Evita que se agregue a si mismo
            if (ciudadOrigen.nombre === ciudadDestino.nombre) continue;

            const diferenciaAltura = aKilometros(Decimal.sub(ciudadOrigen.altura, ciudadDestino.altura).abs());
            const distanciaHaversine = distanciaEntreCoordenadas(
                { lat: ciudadOrigen.latitud, long: ciudadOrigen.longitud },
                { lat: ciudadDestino.latitud, long: ciudadDestino.longitud }
            );
            const distanciaReal = hipotenusa(distanciaHaversine, diferenciaAltura);

            const arista = new Arista(
                grafo.obtenerVertice(ciudadOrigen.nombre),
                grafo.obtenerVertice(ciudadDestino.nombre),
                distanciaReal
            );
            grafo.agregarArista(arista);
        }
    }
    return grafo;
}

/**
 * Algoritmo del problema del viajero(TSP) que calcula la mejor ruta, 
 * generando un ciclo Hamiltoneano, en base a la heuristica
 * del vecino mas cercano
 * @param {Grafo} grafo 
 * @returns {Vertice[]} Vertices en el orden de la ruta
 */
export function tspVecinoCercano(grafo){
    const ruta = [];

    const verticesCiudades = [...grafo.vertices.values()];
    const ciudadInicial = verticesCiudades[0];

    //Se genera un objeto con cada ciudad, para saber si ya fue visitada.
    //Se inicia todo en falso.
    const ciudadVisitada = {};
    for(let verticeCiudad of verticesCiudades){
        ciudadVisitada[verticeCiudad.llave] = false;
    }

    // Se marca la primera ciudad como visitada
    ciudadVisitada[ciudadInicial.llave] = true;
    ruta.push(ciudadInicial);

    for(let i = 0; i < verticesCiudades.length - 1; i++){
        //Se obtiene la ciudad actual, la cual es la ultima visitada.
        const ciudadActual = ruta[ruta.length - 1];
        let distanciaMasCorta = Number.MAX_SAFE_INTEGER;
        let siguienteCiudad = null;

        //Se realiza la búsqueda de la ciudad mas cercana a la ciudad actual
        const ciudadesAdyacentes = grafo.listaAdyacencia.get(ciudadActual.llave);
        for(const ciudadAdyancente of ciudadesAdyacentes.values()){
            const ciudadVecina = ciudadAdyancente.destino;
            const distancia = ciudadAdyancente.peso;

            if(!ciudadVisitada[ciudadVecina.llave] && distancia.lt(distanciaMasCorta)){
                distanciaMasCorta = distancia;
                siguienteCiudad = ciudadVecina;
            }
        }

        ruta.push(siguienteCiudad);
        ciudadVisitada[siguienteCiudad.llave] = true;
    }

    //Se agrega la ciudad inicial al final de la ruta para cerrar el ciclo.
    ruta.push(ciudadInicial);
    return ruta;
}

function inicializador(){
    const { ciudades } = jsonCiudades;
    const grafo = generarGrafo(ciudades);
    const mejorRuta = tspVecinoCercano(grafo);

    // grafo.imprimirMermaid();
    //grafo.imprimir();
    console.log(mejorRuta.map((v, i)=> `${i}. ${v.llave}`));
}


// inicializador();