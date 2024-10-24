import http from 'k6/http';
import { check } from 'k6';

export class OauthApp{

    constructor() {
        //this.baseUrl = baseUrl;;
    }


    loginApp(){

        const authUrl = `http://apps.ourwn.co:8010/oauth2/token/`

        const response = http.post(authUrl,
            {
                grant_type: 'client_credentials',
                client_id: 'nhSlynZaVImQWWz5RYFJPboLMbORdj6P9f2a31Vf',
                client_secret: 'yuvBK3bLV87sy2zlaSLdLrmxrP5lvueS42csKyYsJdF14w0UX8By8apWUIb0VtWwcWJ0oQg4SSSyC1RUWDdTme7y7ReUuFApUpWSUP0KYxYYMrYWerMbtyuTwmXSBL3b',
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