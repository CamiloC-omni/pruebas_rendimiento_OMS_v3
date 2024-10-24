import { http } from 'k6/http';
import { check, group } from 'k6';


export function ValidatePicking (baseURL, authToken) {

    group('validate_picking', function(){

        const urlVP = `${baseURL}/api/v1/stock/picking/validate-picking`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'accept': 'application/json',
        };

        const requestBody = JSON.stringify({
            "id": "<integer>",
            "picking_partial": "<boolean>",
            "immediate_transfer": "<boolean>"
        });


        const response = http.post(urlVP, requestBody, {headers: headers});

        
        if(response.status === 200){
            console.log(`Respuesta obtenida: ${response.status}`);
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }

        check(response, {
            'Status añadir Cantidades 200': (r) => r.status === 200,
        });

    });

}