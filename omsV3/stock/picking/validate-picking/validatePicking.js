import http from 'k6/http';
import { check, group } from 'k6';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


export function validatePicking (authToken, codesIdPicking) {

    let randomIdPicking = randomItem(codesIdPicking);
    
    group('validate_picking', function(){

        const urlVP = `${globalThis.baseUrlCore}/api/v1/stock/picking/validate-picking`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const requestBody = JSON.stringify({
            "id": randomIdPicking.id,
            "picking_partial": "<boolean>",
            "immediate_transfer": randomIdPicking.immediate_transfer
        });


        const response = http.post(urlVP, requestBody, {headers: headers});

        
        if(response.status === 201){
            console.log(`🚀🚀 ~ Respuesta obtenida de Validate_Picking: ${response.status} --> ${response.body}`);

        } else{
            console.error(`❌❌ ~ Error al obtener la respuesta Validate_Picking: ${response.status}, ${response.body}`);
        }

    });

}