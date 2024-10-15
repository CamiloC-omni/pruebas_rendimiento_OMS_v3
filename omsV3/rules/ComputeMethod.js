import http from "k6/http";
import { check } from 'k6';
import {SharedArray} from "k6/data"


const jsonData = new SharedArray('Items Data', function() {
    return JSON.parse(open('/home/camilocomni/K6/pruebas_rendimiento_OMS_v3/data/compute_orden_1.json')).data[0].items;
});


export class ComputeMethod{

    constructor(token, baseUrl){
        this.token = token
        this.baseUrl = baseUrl;
    }
    
    list_items() {
        const itemsDisponibles = jsonData; 

        const numItems = Math.floor(Math.random() * (30 - 10 + 1)) + 10; // Seleccionamos entre 10 y 30 items

        const itemsSeleccionados = this.seleccionarAleatorios(itemsDisponibles, numItems);

        console.log(`Se seleccionaron ${itemsSeleccionados.length} items:`);
        console.log(JSON.stringify(itemsSeleccionados, null, 2));

        return itemsSeleccionados;
    }

    seleccionarAleatorios(array, numItems) {
        const seleccionados = [];
        const arrayCopia = [...array]; // Hacemos una copia del array para no modificar el original

        for (let i = 0; i < Math.min(numItems, array.length); i++) {
            const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);
            seleccionados.push(arrayCopia[indiceAleatorio]);
            arrayCopia.splice(indiceAleatorio, 1); // Remover el item seleccionado para evitar duplicados
        }

        return seleccionados;
    }

    
    computeOrden(){

        const items = this.list_items();
        const computeMethodUrl = `${this.baseUrl}/api/v1/rules/compute-method`;

        const requestBody = JSON.stringify({
            "data": [
                {
                    "shippingDetails": {
                        "address": {
                            "territorial_division": {
                                "level": "pa_corregimiento",
                                "code": "1971"
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
            'Authorization': `Bearer ${this.token}`,
            'accept' : 'application/json'
        }

        const response = http.post(computeMethodUrl, requestBody, {headers:headers});

        check(response, {
            'status es 201': (r) => r.status === 201,
        });

        if (response.status === 201 || response.status === 200) {
            console.log(`Respuesta obtenida: ${response.status}`);
            return response.json();
        } else {
            console.log(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
            return null;
        }
    }
}