import { sleep } from 'k6';
import http from 'k6/http';

//Probar los limites de la palicacion
export const options = {
    stages: [
        {
            duration: '2m',
            target: 50,
        },
        {
            duration: '5m',
            target: 100,
        },
        {
            duration: '2m',
            target: 100,
        },
        {
            duration: '2m',
            target: 100,
        },
    ],
};

export default function(){
    let response = http.get('https://api.escuelajs.co/api/v1/products');
    sleep(1);
}