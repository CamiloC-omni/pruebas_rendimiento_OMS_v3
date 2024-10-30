import http from "k6/http";
import { group } from "k6";


export function Picking(baseURL, authToken) {

    group('picking_get', function(){
        const url = `${baseURL}/api/v1/stock/picking?limit=20`;

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            accept: 'application/json',
        };

        let response = http.get(url, {headers: headers});

        let status = JSON.parse(response.body);

        console.log("🚀 ~ picking_limit - Status:", status.response_standard);
    });
}