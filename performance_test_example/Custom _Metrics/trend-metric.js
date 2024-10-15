import http from 'k6/http';
import { Trend } from 'k6/metrics';

export const options = {
    vus: 10, // número de usuarios virtuales que simularán la carga en la aplicación
    duration: '20s', // tiempo total de ejecución de la prueba
}


const myTrend = new Trend('duration_time');
const mySecondTrend = new Trend('categories_time');

export default function(){

    const request = http.get('https://api.escuelajs.co/api/v1/products');

    myTrend.add(request.timings.duration);

    const categories = http.get('https://api.escuelajs.co/api/v1/categories');
    mySecondTrend.add(categories.timings.duration);
}