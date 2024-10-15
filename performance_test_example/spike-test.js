import { sleep } from 'k6';
import http from 'k6/http';

//Con spike podemos ver como se comporta la pagina con una subida de usuarios tan abrupta en poco tiempo
export const options = {
    stages: [
        {
            duration: '10s',
            target: 10,
        },
        {
            duration: '30s',
            target: 200,
        },
    ],
};

export default function(){
    let response = http.get('');
}