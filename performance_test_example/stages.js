import { sleep } from 'k6';
import http from 'k6/http';


export const options = {
    stages: [
        {
            duration: '20s',
            target: 100,
        },
        {
            duration: '20s',
            target: 100,
        },
    ],
};

export default function(){
    let response = http.get('https://api.escuelajs.co/api/v1/products');
    sleep(1)
}