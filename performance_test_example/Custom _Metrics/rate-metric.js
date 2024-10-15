import http, { request } from 'k6/http';
import { Rate } from 'k6/metrics';

export const options = {
    vus: 10, // número de usuarios virtuales que simularán la carga en la aplicación
    duration: '20s', // tiempo total de ejecución de la prueba
    thresholds: {
        http_req_failed: ["rate<0.35"]
    },
}

//instancia un objeto de tipo Rate con nombre 'called_products'
const myRate = new Rate('Called_products') 

export default function(){

    // función que genera un número aleatorio en un rango dado
    const random  = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // llama a la función random para obtener un número aleatorio entre 1 y 300
    const randomProduct = random(1,3000);
    
     // realiza una petición GET a la API con el número aleatorio generado
    const response = http.get(`https://api.escuelajs.co/api/v1/products/${randomProduct}`);
    myRate.add(1);

     // si el estado de la respuesta es 400, agrega un valor de 0 a la métrica 'called_products', de lo contrario agrega 1
    response.status === 400 ? myRate.add(0) : myRate.add(1);
}