import { group } from 'k6';
import http from 'k6/http';
import { checkResponse } from '../utils/checkResponse.js';


export function validacionTokenUser(token){
    
    group('validacionTokenUser', function(){
        
        const urlValidate = `${globalThis.baseUrlApp}/auth/user/validate/`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'accept': 'application/json',
        };

        const response = http.get(urlValidate, {headers: headers});

        checkResponse(response);

        if(response.status === 200){
            const responseJson = JSON.parse(response.body);
            console.log(`Respuesta obtenida de la validacion del Token Usuario: ${response.status}, ${response.body}`);
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }
    });
}