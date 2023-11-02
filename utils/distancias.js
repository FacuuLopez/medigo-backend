/**
* Calcula la distancia entre dos puntos geográficos. Devuelve metros.
*/
export const calcularDistanciaLineal = (x1, y1, x2, y2) => {
 const rad1 = {
   x: x1 * (Math.PI / 180),
   y: y1 * (Math.PI / 180),
 };
 const rad2 = {
   x: x2 * (Math.PI / 180),
   y: y2 * (Math.PI / 180),
 };

 deltaX = rad1.x - rad2.x;
 deltaY = rad1.y - rad2.y;

 // Se aplica la fórmula del semiverseno
 // https://es.wikipedia.org/wiki/Fórmula_del_semiverseno
 const a =
   Math.sin(deltaX / 2) ** 2 +
   Math.cos(rad1.x) * Math.cos(rad2.x) * Math.sin(deltaY / 2) ** 2;
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

 const RADIO_TIERRA_KM = 6371;

 return RADIO_TIERRA_KM * c * 1000;
};

export const calcularDistanciaCalles = (x1, y1, x2, y2) => {
    const RADIO_TIERRA_M = 6371e3; 

    // Convertir latitud y longitud a radianes
    x1 *= (Math.PI / 180);
    y1 *= (Math.PI / 180);
    x2 *= (Math.PI / 180);
    y2 *= (Math.PI / 180);

    // Convertir latitud y longitud a coordenadas cartesianas
    var carX1 = RADIO_TIERRA_M * Math.cos(x1) * Math.cos(y1);
    var carY1 = RADIO_TIERRA_M * Math.cos(x1) * Math.sin(y1);
    var carX2 = RADIO_TIERRA_M * Math.cos(x2) * Math.cos(y2);
    var carY2 = RADIO_TIERRA_M * Math.cos(x2) * Math.sin(y2);

    var distanciaX = Math.abs(carX1 - carX2);
    var distanciaY = Math.abs(carY1 - carY2);

    // Se aplica la fórmula de distancia Manhattan (compensada a grillas de 45°)
    // https://es.wikipedia.org/wiki/Geometr%C3%ADa_del_taxista
    return Math.sqrt(2) * (distanciaX + distanciaY) / 2; 
}