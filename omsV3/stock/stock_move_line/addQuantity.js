import http from 'k6/http';
import { check, group } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function addQuantity(authToken, stockQuantity){

    let randomQuantity = randomItem(stockQuantity);
    console.log(randomQuantity.id);
    console.log(randomQuantity.quantity);
    
    group('add_quantity', function(){

        const urlAQ = `${globalThis.baseUrlCore}/api/v1/stock/stock-move-line/add-quantity`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const requestBody = JSON.stringify({
            "id": randomQuantity.id,
            "quantity": randomQuantity.quantity
        });

        const response = http.post(urlAQ, requestBody, {headers: headers});

        if(response.status === 200 || response.status === 201){
            console.log(`🚀🚀 ~ Respuesta obtenida de Add_Quantity: ${response.status} --> ${response.body}`);
        } else{
            console.error(`❌❌ ~ Error al obtener la respuesta de Add_Quantity: ${response.status}, ${response.body}`);
        }

    });

}