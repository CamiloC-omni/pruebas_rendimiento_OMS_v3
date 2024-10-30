import http from "k6/http";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { group } from 'k6';
import { checkResponse } from "../utils/checkResponse.js";


export function stock( token, stockAppArray){
    
    let items = stockAppArray[0].sourceItems;
    let items_number = randomItem(items);
    
    
    group("Stock", function(){

        const stockUrl = `${globalThis.baseUrlApp}/api/v1/SUPER99/receipt_stock`;

        let payload = JSON.stringify({
            sourceItems: items_number
        });

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = http.post(stockUrl, payload, {headers: headers});

        checkResponse(response);

        if (response.status === 201 || response.status === 200) {
            console.log(`Respuesta obtenida: ${response.status}`);
            console.log(`Respuesta obtenida: ${response.body}`);
            return response.json();
        } else {
            console.log(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
            return null;
        }

    });
}