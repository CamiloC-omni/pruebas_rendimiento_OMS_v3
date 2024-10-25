import { check } from 'k6';
import http from 'k6/http';


export class ValidateUser{

    constructor(token) {
        this.token = token;
    }

    validateUserToken(){
        
        const url = 'http://apps.ourwn.co:8010/auth/user/validate/';
        

        const headers = {
            
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`,
            'accept': 'application/json',
        }

        const response = http.get(url, {headers: headers});

        check(response, {
            'validate user token 200': (r) => r.status === 200,
        });

        if(response.status === 200){
            const responseJson = JSON.parse(response.body);
            console.log(`Respuesta obtenida del Usuario: ${response.status}, ${response.body}`);
            return responseJson;
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }

    }; 

}