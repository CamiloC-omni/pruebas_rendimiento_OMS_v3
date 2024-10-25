import http from 'k6/http';
import { group } from 'k6';
import { checkResponse } from '../../utils/checkResponse.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function client( token ){

    let bodyClient;

    group('client', function(){
        let clientUrl = `${globalThis.baseUrlCore}/api/v1/client`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
        };

        let response = http.get(clientUrl, { headers: headers });

        checkResponse(response);

        if(response.status === 200){
            bodyClient = JSON.parse(response.body);
            console.log(`🔎 ~ Clientes mostrados correctamente: ${bodyClient}`);
        } else {
            console.error(`❌❌ ~ Error cliente: ${response.status}, ${response.body}`);
        };
  
    });
    return bodyClient

}

export function pageClient(token, listClient){
    let bodyClient;

    group('pagination', function(){
        const limit = 20;  
        let totalClient = 0;
        
        
        let clientList;
        try {
            clientList = JSON.parse(listClient);
        } catch (error) {
            console.error('Error al parsear listClient como JSON:', error, 'Contenido:', listClient);
            return;
        }

        let metaData = clientList.meta_data;
    
        if (!metaData || typeof metaData.total === 'undefined') {
            console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', listClient );
        }

        if (totalClient === 0) {
            totalClient = metaData.total;  
        }

        let offset = randomIntBetween(1, parseInt(totalClient/limit) + 1);

        let clientUrl2 = `${globalThis.baseUrlCore}/api/v1/client?offset=${offset}&limit=${limit}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
        };

        let response = http.get(clientUrl2, { headers: headers });

        checkResponse(response);

        if(response.status === 200){
            bodyClient = JSON.parse(response.body);
            console.log(`📖 ~ Clientes paginados correctamente: ${clientUrl2}`);
        } else {
            console.error(`❌❌ ~ Error paginacion: ${response.status}, ${response.body}`);
        };
    });
}
