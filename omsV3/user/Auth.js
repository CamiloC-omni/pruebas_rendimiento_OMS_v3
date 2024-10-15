import http from 'k6/http';
import { check } from 'k6';

export class Auth{

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = this.login();
    }

    login(){
        
        const authUrl = `${this.baseUrl}/api/v1/user/auth/login`


        const requestBody = JSON.stringify({
            'username': 'testing',
            'password': 'Xu531pm0C-',
            'tenant' : 'SUPER99'
        });

        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }

        const response = http.post(authUrl, requestBody, {headers: headers});

        check(response, {
            'login successful': (r) => r.status === 200,
        });


        if (response.status === 200) {
            
            //const token = JSON.parse(response.json('authentication_result').token);
            const token = response.json('authentication_result').token;
            console.log(`Se genero correctamente el Token: ${token}`);
            return token;
        } else {
            console.log(`Error generando el Token: ${response.status}, ${response.body}`);
            return null;
        }
    }

}