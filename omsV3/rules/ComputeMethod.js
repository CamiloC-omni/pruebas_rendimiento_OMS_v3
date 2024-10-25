import http from "k6/http";
import { check } from 'k6';
import {SharedArray} from "k6/data"


const jsonData = new SharedArray('Items Data', function() {
    return JSON.parse(open('../../data/product_items.json'));
});


export function ComputeMethod(authToken){

    
    group('computeOrden', function(){

        const items = this.list_items();
        const computeMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/compute-method`;

        const requestBody = JSON.stringify({
            data: [
                {
                    shippingDetails: {
                        address: {
                            territorial_division: {
                                level: "pa_corregimiento",
                                code: "1971"
                            } 
                        },
                        method: {
                            code: "Domicilio2",
                            warehouse_code: "1959"
                        }
                    },
                    items: items
                }
            ]
        });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept' : 'application/json'
        }

        const response = http.post(computeMethodUrl, requestBody, {headers:headers});

        if (response.status === 201 || response.status === 200) {
            console.log(`Respuesta obtenida: ${response.status}`);
            return response.json();
        } else {
            console.log(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
            return null;
        }
    });
}