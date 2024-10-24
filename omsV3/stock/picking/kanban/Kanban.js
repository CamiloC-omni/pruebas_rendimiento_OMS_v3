import { http } from 'k6/http';
import { check, group } from 'k6';
import { SharedArray } from 'k6/data';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

const codesIdArray = new SharedArray('codes_Id', function() {
    return JSON.parse(open('./data/codesid.json'));
});


export function Kanban(baseURL, authToken) {

    let picking_id = randomItem(codesIdArray);

    group('picking_kanban_get', function(){

        const urlKanban = `${baseURL}/api/v1/stock/kanban?id=${picking_id}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlKanban, {headers: headers});

        if(response.status === 201 || response.status === 200){
            console.log(`Respuesta obtenida: ${response.status}`);
        } else{
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}`);
        }

        check(response, {
            'Status obtener Kanban 200': (r) => r.status === 200,
        });

    });

}