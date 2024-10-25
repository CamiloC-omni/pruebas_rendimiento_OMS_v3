import http from 'k6/http';
import { check, group } from 'k6';

export class Auth{

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    login(){
        
        const authUrl = `${this.baseUrl}/api/v1/user/auth/login`


        const requestBody = JSON.stringify({
            'username': globalThis.clientId,
            'password': globalThis.clientPassword,
            'tenant' : globalThis.tenant,
        });

        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        };

        const response = http.post(authUrl, requestBody, {headers: headers});

        check(response, {
            'login successful': (r) => r.status === 200,
        });

        if (response.status === 200){
            
            let token = response.json('authentication_result').token;
            console.log(`Se genero correctamente el Token: ${token}`);
            return token;
        } else {
            console.log(`Error generando el Token: ${response.status}, ${response.body}`);
            return null;
        }
    }         
}


// export function auth(){
//     let token;

//     group('auth', function(){
//         const urlAut = `${globalThis.baseURL}/api/v1/auth/token`

//         const payload = JSON.stringify({
//             'username': 'testing',
//             'password': 'Xu531pm0C-',
//             'tenant' : 'SUPER99',
//         });

//         const headers = {
//             'Content-Type' : 'application/json',
//             'Accept' : 'application/json'
//         }

//         const response = http.post(urlAut, payload, {headers:headers});

//         check(response, {
//             'login successful': (r) => r.status === 200,
//         });


//         if(response.status === 200){
//             const body = JSON.parse(response.body);
//             token = body.authentication_result.token;
//             console.log(`🚀 ~ Token generado correctamente: ${token}`);
//         } else {
//             console.error(`❌❌ ~ Error al generar el Token: ${response.status}, ${response.body}`);
//             token = null;
//         };
//     });

//     return token;

// }