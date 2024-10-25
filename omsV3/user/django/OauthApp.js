import http from 'k6/http';
import { check } from 'k6';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export class OauthApp{

    constructor() {
        //this.baseUrl = baseUrl;;
    }

    

    loginApp(){

        const clientCredentials = [
            {
                client_id: 'nhSlynZaVImQWWz5RYFJPboLMbORdj6P9f2a31Vf',
                client_secret: 'yuvBK3bLV87sy2zlaSLdLrmxrP5lvueS42csKyYsJdF14w0UX8By8apWUIb0VtWwcWJ0oQg4SSSyC1RUWDdTme7y7ReUuFApUpWSUP0KYxYYMrYWerMbtyuTwmXSBL3b',
            },
            {
                client_id: '35SJpBgpT9yOnq6I63ugI2fDAogUp9TXlT51J8sm',
                client_secret: 'bWA56LfHaIGLfKbUm8Q7GZ3IkV1RJh6oJZv93rKWxZUGzX0tsCSDPo3QQmS4ZrBkAp50ETV88iRzNf5WsEgaNsJoR8gnX7RXiWKEpK9jXjdNunw8ORuMhi6d4OV0BGnt',
            },
            {
                client_id: 'XaMPbeDmm7Q5TGN9UBR47KOdHCo5HFMzpwVh3rvK',
                client_secret: 'z9IjNZbHHQVxlTByEQU9EFsKc7rKO9noC3rmjTArUvEl5xVgj209zAUCUy2pwNcBqhzErUBVpL8Vk0oGwoNIARuaQAtpvyb5a1wQIiEGneSkRIWpm85AjjY0BEW7mIeg',
            },
        ];

        let credential = randomItem(clientCredentials);

        let randomClientId = credential.client_id;
        let randomClientSecret = credential.client_secret;
        
        const authUrl = `http://apps.ourwn.co:8010/oauth2/token/`

        const response = http.post(authUrl,
            {
                grant_type: 'client_credentials',
                client_id: randomClientId,
                client_secret: randomClientSecret,
            }, {headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }});

        check(response, {
            'login successful': (r) => r.status === 200,
        });

        if (response.status === 200){
            
            const body = JSON.parse(response.body);
            let tokenOauth = body.access_token;
            console.log(`Se genero correctamente el Token de la App: ${tokenOauth}`);
            return tokenOauth;
        } else {
            console.log(`Error generando el Token de la App: ${response.status}, ${response.body}`);
            return null;
        }
    }         
}