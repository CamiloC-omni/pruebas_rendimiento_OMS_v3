import http from 'k6/http';
import { Counter } from 'k6/metrics';

export const options = {
    vus: 100,
    duration: '20s',
}

const productsCounter = new Counter('called_products')
const categoriesCounter = new Counter('called_categories')
const usersCounter = new Counter('called_users')

export default function(){
    switch(Math.floor(Math.random() *3)){    
        case 0:
            let products = http.get('https://api.escuelajs.co/api/v1/products');
            productsCounter.add(1);
            break;
        case 1:
            let categoties = http.get('https://api.escuelajs.co/api/v1/categories');
            categoriesCounter.add(1);
            break;
        case 2:
            let users = http.get('https://api.escuelajs.co/api/v1/categories');
            usersCounter.add(1);
            break;
        default:
            break;
    }
}