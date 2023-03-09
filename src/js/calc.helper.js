import { Decimal } from 'decimal.js';
import { EARTH_RADIUS } from './constant.js';

/**
 * @typedef {{lat: number, long: number}} Coordinate
 */

/**
 * Convierte valores de grados a radianes.
 * @param {number} degrees 
 * @returns {Decimal}
 */
export function toRadian(degrees) {
    return new Decimal(degrees).mul(Math.PI).div(180);
}

/**
 * Calcula la sección de seno al cuadrado de la ecuación de Haversine.
 * @param {Decimal} value1 
 * @param {Decimal} value2 
 * @returns {Decimal}
 */
export function haversine(value1, value2) {
    return Decimal.sin(
        value2.minus(value1).div(2)
    ).pow(2);
}

/**
 * Calcula la distancia entre dos coordenadas(latitud, longitud).
 * @param {Coordinate} coord1 
 * @param {Coordinate} coord2 
 * @returns 
 */
export function distanceBetweenCoords(coord1, coord2) {
    const latitude1 = toRadian(coord1.lat);
    const latitude2 = toRadian(coord2.lat);
    const longitude1 = toRadian(coord1.long);
    const longitude2 = toRadian(coord2.long);

    const mulCos = Decimal.mul(
        latitude2.cos(),
        latitude1.cos()
    );

    const haversineLongitude = mulCos
        .mul(haversine(longitude2, longitude1));

    const squareRoot = haversine(latitude2, latitude1)
        .plus(haversineLongitude)
        .sqrt();

    return Decimal.mul(2, EARTH_RADIUS).mul(squareRoot.asin());
}