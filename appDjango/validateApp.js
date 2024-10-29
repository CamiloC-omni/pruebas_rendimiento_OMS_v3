
import { group } from 'k6';
import http from 'k6/http';
import { checkResponse } from '../utils/checkResponse.js';


export function validateAppToken(token){
    
    group('validateAppToken', function(){
        
        const urlValidate = `${globalThis.baseUrlApp}/auth/token/validate/`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            'accept': 'application/json',
        }

        const response = http.get(urlValidate, {headers: headers});

        checkResponse(response);

        if(response.status === 200){
            const responseJson = JSON.parse(response.body);
            console.log(`Respuesta obtenida de la validacion del Token APP: ${response.status}, ${response.body}`);
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }
    
    
    });

}