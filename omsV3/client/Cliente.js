import http from 'k6/http';
import { check, sleep } from 'k6';

export class Client {

    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }


    getClient() {
    
        let clientUrl = `${this.baseUrl}/api/v1/client`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'accept': 'application/json',
        };

        let response = http.get(clientUrl, { headers: headers });

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(response.body);
        } catch (e) {
            console.error('Error al parsear la respuesta JSON:', e);
        }
 
        check(response, {
            'Status mostrar Clientes 200': (r) => r.status === 200,
        });

        return jsonResponse
     
    }

    pageClient(responseJson){

        const limit = 20;  
        let totalClient = 0;
        let responseJsonParse = JSON.parse(responseJson);
        let metaData = responseJsonParse.meta_data;
    

        if (!metaData || typeof metaData.total === 'undefined') {
            console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', responseJson );
        }

        if (totalClient === 0) {
            totalClient = metaData.total;  
        }

        let offset = Math.floor(Math.random() * (totalClient / limit) + 1);

        let clientUrl2 = `${this.baseUrl}/api/v1/client?offset=${offset}&limit=${limit}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'accept': 'application/json',
        };

        let response = http.get(clientUrl2, {headers:headers});
        
        if(response.status === 200){
            console.log(`Estado = ${response.status}, links = ${clientUrl2}`)
            //console.log(response.body);
        } else {
            console.error(`Error al obtener la respuesta: ${response.status}, ${response.body}, Link: ${clientUrl2}`)
            
        }

        check(response, {
            'Status paginacion de Clientes is 200': (r) => r.status === 200,
        })

    
    }
    

}
