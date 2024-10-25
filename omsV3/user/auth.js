import http from 'k6/http';
import { group } from 'k6';
import { checkResponse } from '../../utils/checkResponse.js';

export function auth(){
    let token;

    group('auth', function(){
        const urlAut = `${globalThis.baseUrlCore}/api/v1/user/auth/login`

        const payload = JSON.stringify({
            username: `${globalThis.clientIdCore}`,
            password: `${globalThis.clientSecretCore}`,
            tenant : `${globalThis.tenant}`,
        });

        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        };

        
        const response = http.post(urlAut,payload,{headers:headers});
        
        checkResponse(response);

        if(response.status === 200){
            const body = JSON.parse(response.body);
            token = body.authentication_result.token;
            console.log(`🚀 ~ Token generado correctamente: ${token}`);
        } else {
            console.error(`❌❌ ~ Error al generar el Token: ${response.status}, ${response.body}`);
            token = null;
        };
    });

    return token;

}