import  http from 'k6/http';
import { check } from 'k6';


export class OauthUser{

    constructor() {
    }


    loginUser(){

        const authUrl = 'http://apps.ourwn.co:8010/auth/users/login/';

        const requestBody = JSON.stringify({
            "email": "test@omni.pro",
            "password": "Xu531pm0C"
        });

        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };

        const response = http.post(authUrl, requestBody, {headers: headers});

        check(response, {
            'login successful': (r) => r.status === 200,
        });


        if(response.status === 200){
            const token = response.json('access_token')
            console.log(`Se genero correctamente el Token del Usuario: ${token}`);
            return token;
        } else{
            console.error(`Error al obtener la respuesta del Usuario: ${response.status}, ${response.body}`);
        }

    }
}