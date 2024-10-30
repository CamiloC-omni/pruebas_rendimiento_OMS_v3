import http from "k6/http";
import { check, group } from 'k6';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


export function computeMethod(authToken, itemsProductos){


    let rangoitems = randomIntBetween(20, 35);

    let items = [];
    for (let i = 0; i < rangoitems; i++) {
        let itemsRandom = randomItem(itemsProductos);
        items.push(itemsRandom);
    }

    group('computeOrden', function(){

        
        const computeMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/compute-method`;

        const requestBody = JSON.stringify({
            "data": [
              {
                "shippingDetails": {
                  "address": {
                    "territorial_division": {
                      "code": "1971",
                      "level": "pa_corregimiento"
                    }
                  },
                  "method": {
                    "code": "Domicilio2",
                    "warehouse_code": "1959"
                  }
                },
                "items": items
              }
            ]
          });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept' : 'application/json'
        }

        const response = http.post(computeMethodUrl, requestBody, {headers:headers});

        check(response, {
            'is status 201': (r) => r.status === 201,
        });

        if (response.status === 201 || response.status === 200) {
            console.log(`🚀🚀 ~ Respuesta obtenida de Compute-Method: ${response.status}, ${response.body}`);
            //return response.json();
        } else {
            console.log(`❌❌ ~ Error al obtener la respuesta en Compute-Method: ${response.status}, ${response.body}, ${response.request.body}`);
            //return null;
        }
    });
}