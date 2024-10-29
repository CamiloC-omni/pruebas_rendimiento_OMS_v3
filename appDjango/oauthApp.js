import http from 'k6/http';
import { group } from 'k6';
import { checkResponse } from '../utils/checkResponse.js';


export function oauthApp(){

    let tokenOauth;

    group('tokenOauthApp', function(){

        const appUrl = `${globalThis.baseUrlApp}/oauth2/token/`;

        const payload = {
            grant_type: 'client_credentials',
            client_id: globalThis.clientIdOauth,
            client_secret: globalThis.clientSecretOauth,
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const response = http.post(appUrl, payload,{headers:headers});

        
        checkResponse(response);

        if(response.status === 200){
            const body = JSON.parse(response.body);
            tokenOauth = body.access_token;
            console.log(`🚀 ~ Token de la App se genero correctamente: ${tokenOauth}`);
        } else {
            console.log(`❌❌ ~ Error generando el Token de la App: ${response.status}, ${response.body}`);
        }

    });

    return tokenOauth;
        
};