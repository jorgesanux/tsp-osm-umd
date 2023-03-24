import { COORDENADAS_INICIALES, ZOOM, COLORES } from "./constantes.js";

// Elementos del DOM
let entradaArchivo;
let botonEnviar, botonLimpiar;
let mapa;
let marcadores = [];
let lineas = []

function limpiarMarcadores() {
    for (const marcador of marcadores) {
        marcador.remove();
    }
    marcadores = [];
}

function limpiarLineas() {
    for (const linea of lineas) {
        linea.remove();
    }
    lineas = [];
}

function generarColorAleatorio() {
    return COLORES[Math.floor(Math.random() * COLORES.length)];
}

function limpiar() {
    limpiarMarcadores();
    limpiarLineas();
    entradaArchivo.value = "";
}

function dibujar(ciudades) {
    for (const [indice, ciudad] of ciudades.entries()) {
        if (indice >= ciudades.length - 1) break;
        const { latitud, longitud, nombre } = ciudad;
        const marcador = L.marker([latitud, longitud]).addTo(mapa);
        marcador.bindPopup(`${indice + 1} - ${nombre}`, {
            autoClose: false
        }).openPopup();
        marcadores.push(marcador);
    }

    const color = generarColorAleatorio();

    //No tiene sentido dibujar lineas cuando no hay 2 marcadores mínimo.
    if (marcadores.length >= 2) {
        const marcadorInicial = marcadores[0];
        for (let i = 0; i < marcadores.length; i++) {
            const marcadorOrigen = marcadores[i];

            // Valida si no es el ultimo marcador para conectarlo con el siguiente.
            // Si es el ultimo marcador, realiza la conexión con el marcador inicial.
            const marcadorDestino = (i !== marcadores.length - 1)
                ? marcadores[i + 1]
                : marcadorInicial;

            const linea = L.polyline(
                [
                    marcadorOrigen.getLatLng(),
                    marcadorDestino.getLatLng()
                ],
                { color },
            ).addTo(mapa);

            lineas.push(linea);
        }
    }
}

function eventos() {
    window.addEventListener("load", function () {
        limpiar();
    });

    botonEnviar.addEventListener("click", async function (e) {
        try {
            const archivo = entradaArchivo.files[0];
            const datosFormulario = new FormData();
            datosFormulario.append("archivo", archivo);

            const response = await fetch("/api/calcular_ruta", {
                method: "POST",
                body: datosFormulario
            });
            const json = await response.json();
            const { results: ciudades, code: codigo, message: mensaje } = json;

            if (codigo !== 200) throw new Error(mensaje);

            limpiar();
            dibujar(ciudades);
        } catch (error) {
            alert(`Ocurrió un error: ${error.message}`);
        }
    });

    botonLimpiar.addEventListener("click", function() {
        limpiar();
    });
}


function inicializador() {
    entradaArchivo = document.querySelector(".entrada_archivo");
    botonEnviar = document.querySelector(".boton_enviar");
    botonLimpiar = document.querySelector(".boton_limpiar");
    mapa = L.map("mapa").setView(COORDENADAS_INICIALES, ZOOM);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    eventos();
}

inicializador();