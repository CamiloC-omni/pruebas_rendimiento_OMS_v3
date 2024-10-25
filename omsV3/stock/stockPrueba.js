import http from "k6/http";
import {SharedArray} from "k6/data";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { check } from 'k6';

const stockArray = new SharedArray("stock", function () {
    return JSON.parse(open("../../data/stock.json"));
});


export class Stock {


    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    stockPost(){
        let items = stockArray[0].sourceItems;
        let items_number = randomItem(items);


        let stockUrl = `${this.baseUrl}/api/v1/SUPER99/receipt_stock`;

        let payload = JSON.stringify({
            sourceItems: items_number
        });

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`,
        };

        let response = http.post(stockUrl, payload, {headers: headers});

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