import { distanceBetweenCoords } from "./src/js/calc.helper.js";

const coord1 = {
    lat: 4.6483,
    long: -74.0703
}

const coord2 = {
    lat: 6.2442,
    long: -75.5662
}

console.log(distanceBetweenCoords(coord1, coord2).toNumber());