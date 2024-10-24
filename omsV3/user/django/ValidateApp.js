
import { check } from 'k6';
import http from 'k6/http';


export class ValidateApp{

    constructor(token) {
        this.token = token;
    }

    validateAppToken(){
        
        const url = 'http://apps.ourwn.co:8010/auth/token/validate/';

        const headers = {
            
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`, 
            'accept': 'application/json',
        }

        const response = http.get(url, {headers: headers});

        check(response, {
            'validate app token 200': (r) => r.status === 200,
        });

        if(response.status === 200){
            const responseJson = JSON.parse(response.body);
            console.log(`Respuesta obtenida de la APP: ${response.status}, ${response.body}`);
            return responseJson;
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }

    }; 

}