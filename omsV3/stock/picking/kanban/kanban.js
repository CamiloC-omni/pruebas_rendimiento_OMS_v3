import http  from 'k6/http';
import { check, group } from 'k6';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";




export function kanban(authToken, codesIdArray) {

    let pickingId = randomItem(codesIdArray);
    

    group('picking_kanban_get', function(){

        const urlKanban = `${globalThis.baseUrlCore}/api/v1/stock/picking/kanban?id=${pickingId.id}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlKanban, {headers: headers});

        check(response, {
            'is status 201': (r) => r.status === 201,
        });

        if(response.status === 201 || response.status === 200){
            console.log(`🔎 ~ Respuesta obtenida de Picking_Kanban: ${response.status} --> ${response.body}`);
        } else{
            console.error(`❌❌ ~ Error al obtener la respuesta de Picking_Kanban: ${response.status}, ${response.body}`);
        }

    });

}