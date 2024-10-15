import {http} from 'k6/http';
import { check } from 'k6';


export class AddQuantity {

    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    addQuantityPost(){

        const urlAQ = `${this.baseUrl}/api/v1/stock/stock-move-line/add-quantity`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'accept': 'application/json',
        };

        const requestBody = JSON.stringify({
            "id": "<integer>",
            "quantity": "<number>",
            "payload": {}
        });


        const response = http.post(urlAQ, requestBody, {headers: headers});

        
        if(response.status === 200){
            console.log(`Respuesta obtenida: ${response.status}`);
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }

        check(response, {
            'Status añadir Cantidades 200': (r) => r.status === 200,
        });

    }

}