import  http from 'k6/http';
import { group } from 'k6';
import { checkResponse } from '../utils/checkResponse.js';

export function oauthUser(){

    let tokenUser;

    group('tokenOauthUser', function(){

        const UrlUser = `${globalThis.baseUrlApp}/auth/users/login/`;

        const payload = JSON.stringify({
            "email": "test@omni.pro",
            "password": "Xu531pm0C"
        });

        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }

        const response = http.post(UrlUser, payload,{headers:headers});

        
        checkResponse(response);

        if(response.status === 200){
            const body = JSON.parse(response.body);
            tokenUser = body.access_token;
            console.log(`🚀 ~ Token generado correctamente: ${tokenUser}`);
        } else {
            console.log(`❌❌ ~ Error generando el Token de la App: ${response.status}, ${response.body}`);
        }

    });

    return tokenUser;
        
};