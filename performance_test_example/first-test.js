import http from 'k6/http';


export const options = {
    vus: 100,
    duration: '1m',
}


export default function(){
    let response = http.get('https://api.escuelajs.co/api/v1/products');
}