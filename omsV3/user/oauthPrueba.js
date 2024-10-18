import http from 'k6/http';
import { check } from 'k6';

export class Oauth{

    constructor() {
        //this.baseUrl = baseUrl;
        this.token = this.login();
    }


    login(){
        let tokenOauth;

        const authUrl = `http://apps.ourwn.co:8010/oauth2/token/`

        const response = http.post(authUrl, 
            {
                grant_type: 'client_credentials',
                client_id: 'nhSlynZaVImQWWz5RYFJPboLMbORdj6P9f2a31Vf',
                client_secret: 'yuvBK3bLV87sy2zlaSLdLrmxrP5lvueS42csKyYsJdF14w0UX8By8apWUIb0VtWwcWJ0oQg4SSSyC1RUWDdTme7y7ReUuFApUpWSUP0KYxYYMrYWerMbtyuTwmXSBL3b',
            }, 
            {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

        check(response, {
            'login successful': (r) => r.status === 200,
        });

        if (response.status === 200){
            
            const body = JSON.parse(response.body);
            tokenOauth = body.access_token;
            console.log(`Se genero correctamente el Token: ${tokenOauth}`);
            return tokenOauth;
        } else {
            console.log(`Error generando el Token: ${response.status}, ${response.body}`);
            return null;
        }
    }         
}