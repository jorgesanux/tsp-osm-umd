const entradaArchivo = document.querySelector(".entrada_archivo");
const botonEnviar = document.querySelector(".boton_enviar");
const mapa = L.map("mapa").setView([4.750039062160531, -74.0958234459527], 6.5);

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

function colorAleatorio() {
    const colores = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FFA500"];
    return colores[Math.floor(Math.random() * colores.length)];
}

botonEnviar.addEventListener("click", async function (e) {
    limpiarMarcadores();
    limpiarLineas();
    const archivo = entradaArchivo.files[0];
    const datosFormulario = new FormData();
    datosFormulario.append("archivo", archivo);

    const response = await fetch("/api/calcular_ruta", {
        method: "POST",
        body: datosFormulario
    });
    const json = await response.json();
    const { results: ciudades } = json;
    for (let i = 0; i < ciudades.length; i++) {
        const marcador = L.marker([ciudades[i].latitud, ciudades[i].longitud]).addTo(mapa);
        if (i !== ciudades.length - 1) {
            marcador.bindPopup(`${i + 1} - ${ciudades[i].nombre}`, {
                autoClose: false
            }).openPopup();
        }
        marcadores.push(marcador);
    }

    const color = colorAleatorio();
    for (let i = 0; i < marcadores.length - 1; i++) {
        const marcador1 = marcadores[i];
        const marcador2 = marcadores[i + 1];

        const linea = L.polyline(
            [marcador1.getLatLng(), marcador2.getLatLng()],
            { color },
        ).addTo(mapa);
        lineas.push(linea);
    }
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

// L.marker([4.750039062160531, -74.0958234459527]).addTo(mapa);