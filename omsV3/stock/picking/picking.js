import http from "k6/http";
import { check, group, sleep } from "k6";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Counter } from 'k6/metrics';



export function pickingGet(authToken) {

    group('picking_get', function(){
        const urlPicking = http.url`${globalThis.baseUrlCore}/api/v1/stock/picking`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        let response = http.get(urlPicking, {headers: headers});

        check(response, {
            'Es status 200': (r) => r.status === 200,
        });

        if(response.status !== 200){
            console.error(`❌❌ ~ Error en ver Picking ${response.status}, Respuesta: ${response.body}`);
        }

        console.log(`Estatus:${response.status} ~ Picking: ${response.body}`);
    });
}


export const errorPicking = new Counter('Error_Picking')

export function pickinPagination(authToken) {

    const limit = 20;
    const totalPicking = 4591;

    let offset = randomIntBetween(1, parseInt(totalPicking/limit) + 1);

    group('picking_Pagination', function(){
        try {

            const urlPicking = http.url`${globalThis.baseUrlCore}/api/v1/stock/picking?limit=${limit}&offset=${offset}`;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'accept': 'application/json',
            };

            let response = http.get(urlPicking, {headers: headers});

            let assertPicking = check(response, {
                'Es status 200': (r) => r.status === 200,
            });

            if(assertPicking){
                console.log(`🔎👌 ~ Estatus: ${response.status} Picking mostrado correctamente. Pagina: ${offset}`);
            } else {
                console.error(`❌👌 ~ Error en buscar Picking ${response.status}, Respuesta: ${response.body}, Pagina: ${offset}`);
                errorPicking.add(1);
            };
                      
        } catch (error) {
            console.error(`❌❌ ~ Error en Picking ${error}, ${error.message}`);
            errorPicking.add(1);
        }
        
        sleep(1);
    });

};