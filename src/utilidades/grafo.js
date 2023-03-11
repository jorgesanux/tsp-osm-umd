import Decimal from "decimal.js";

/**
 * Genera un Vertice
 * @class
 * @constructor
 * @public
 */
export class Vertice {
    /**
     * @type {string}
     */
    #llave;
    
    /**
     * @param {string} llave Llave que identifica el vértice
     */
    constructor(llave){
        this.#llave = llave;
    }

    get llave(){
        return this.#llave;
    }

    toString(){
        return this.llave;
    }
}

/**
 * Geenra una arista
 * @class
 * @constructor
 * @public
 */
export class Arista {
    /**
     * @type {Vertice}
     */
    #origen;

    /**
     * @type {Vertice}
     */
    #destino;

    /**
     * @type {Decimal}
     */
    #peso;

    /**
     * 
     * @param {Vertice} origen Vertice de origen
     * @param {Vertice} destino Vertice de destino
     * @param {Decimal} peso Peso de la arista
     */
    constructor(origen, destino, peso){
        this.#origen = origen;
        this.#destino = destino;
        this.#peso = peso;
    }

    get origen(){
        return this.#origen;
    }

    get destino(){
        return this.#destino;
    }

    get peso(){
        return this.#peso;
    }

    toString(){
        return `${this.#origen} -(${this.#peso})-> ${this.#destino}`;
    }
}


/**
 * Genera un Grafo no direccionado.
 * @class
 * @constructor
 * @public
 */
export class Grafo{
    /**
     * Conjunto de vértices
     * @type {Set<Vertice>}
     */
    #vertices;

    /**
     * Mapa con las relaciones de adyacencia de cada vértice
     * @type {Map<string, Set<Arista>>}
     */
    #listaAdyacencia;

    constructor(){
        this.#vertices = new Set();
        this.#listaAdyacencia = new Map();
    }

    get vertices(){
        return this.#vertices;
    }

    get listaAdyacencia(){
        return this.#listaAdyacencia;
    }

    /**
     * Realizar la búsqueda y retorna un vértice a partir de la llave
     * @param {string} llave 
     * @returns {Vertice}
     */
    obtenerVertice(llave){
        for(let vertice of this.#vertices.values()){
            if(vertice.llave === llave) return vertice;
        }
    }

    /**
     * Agrega un vértice al conjunto de vértices
     * @param {Vertice} vertice 
     */
    agregarVertice(vertice){
        this.#vertices.add(vertice);
        if(!this.#listaAdyacencia.has(vertice.llave)){
            this.#listaAdyacencia.set(vertice.llave, new Set());
        }
    }

    /**
     * Agregar un arreglo de vértices al conjunto de vértices
     * @param {Vertice[]} vertices
     */
    agregarVertices(vertices){
        for(let i = 0; i < vertices.length; i++){
            this.agregarVertice(vertices[i]);
        }
    }

    // /**
    //  * Agrega una arista a la lista de adyacencia, relacionando
    //  * los nodos de origen y destino
    //  * @param {any} verticeOrigen 
    //  * @param {any} verticeDestino 
    //  */
    // agregarArista(verticeOrigen, verticeDestino){
    //     this.#listaAdyacencia.get(verticeOrigen).add(verticeDestino);
    //     this.#listaAdyacencia.get(verticeDestino).add(verticeOrigen);
    // }

    /**
     * Agrega una arista a la lista de adyacencia, relacionando
     * los nodos de origen y destino
     * @param {Arista} nuevaArista 
     */
    agregarArista(nuevaArista){
        const aristas = this.#listaAdyacencia.get(nuevaArista.origen.llave);
        for(const arista of aristas){
            if(arista.destino.llave === nuevaArista.destino.llave) return;
        }
        this.#listaAdyacencia.get(nuevaArista.origen.llave).add(nuevaArista);
    }

    imprimir(){
        for(const nombreVertice of this.#listaAdyacencia.keys()){
            console.log(`- ${nombreVertice}`);
            for(const arista of this.listaAdyacencia.get(nombreVertice)){
                console.log(`\t${arista}`);
            }
        }
    }
}