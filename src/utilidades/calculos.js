import { Decimal } from 'decimal.js';
import { RADIO_TIERRA } from './contantes.js';

/**
 * @typedef {{lat: number, long: number}} Coordenada
 */

/**
 * Convierte valores de grados a radianes.
 * @param {number} grados 
 * @returns {Decimal}
 */
export function aRadianes(grados) {
    return new Decimal(grados).mul(Math.PI).div(180);
}

/**
 * Calcula la sección de seno al cuadrado de la ecuación de Haversine.
 * @param {Decimal} valor1 
 * @param {Decimal} valor2 
 * @returns {Decimal}
 */
export function haversine(valor1, valor2) {
    return Decimal.sin(
        valor2.minus(valor1).div(2)
    ).pow(2);
}

/**
 * Calcula la distancia entre dos coordenadas(latitud, longitud).
 * @param {Coordenada} coord1 
 * @param {Coordenada} coord2 
 * @returns 
 */
export function distanciaEntreCoordenadas(coord1, coord2) {
    const latitud1 = aRadianes(coord1.lat);
    const latitud2 = aRadianes(coord2.lat);
    const longitud1 = aRadianes(coord1.long);
    const longitud2 = aRadianes(coord2.long);

    const mulCos = Decimal.mul(
        latitud2.cos(),
        latitud1.cos()
    );

    const haversineLongitud = mulCos
        .mul(haversine(longitud2, longitud1));

    const raizCuadrada = haversine(latitud2, latitud1)
        .plus(haversineLongitud)
        .sqrt();

    return Decimal.mul(2, RADIO_TIERRA).mul(raizCuadrada.asin());
}