import { Auth } from './omsV3/user/auth.js';
import { Client } from './omsV3/client/Cliente.js';
import { ComputeMethod } from './omsV3/rules/ComputeMethod.js';
import { Stock } from './omsV3/stock/stockPrueba.js';
import { OauthApp } from './omsV3/user/django/OauthApp.js';
import { OauthUser } from './omsV3/user/django/OauthUser.js'
import { ValidateApp } from './omsV3/user/django/ValidateApp.js';
import { ValidateUser } from './omsV3/user/django/ValidateUser.js';
import { config } from './config/config.js';

globalThis.baseURLCore = config.baseURLCore;
globalThis.clientId = config.clientId;
globalThis.clientSecret = config.clientPassword;
globalThis.tenant = config.tenant;

const allScenarios = {
    shared_iterations_test: {
        executor: 'shared-iterations',
        exec:'oauthAppTest', //Cambiar si se va a ejecutar otro
        iterations: 10,
        vus: 10,
        maxDuration: '30s', 
        //description: 'Establece un numero fijo de iteraciones, comprarte iteraciones entre VUs https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/shared-iterations/'
    },
    per_vu_iterations_test: {
        executor: 'per-vu-iterations',
        //preAllocatedVUs: 1, 
        vus: 5,
        iterations: 20,
        timeUnit: '1s',
        maxDuration: '2m',
        //description: 'Establece un numero fijo de iteraciones, hace que cada VU ejecute las iteraciones configuradas https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/per-vu-iterations/'
    },
    constant_vus_test: {
        executor: 'constant-vus',
        vus: 100,
        duration: '2m', 
        //description: 'Establece un numero fijo de VUs, envía VUs a un número constante https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-vus/'
    },
    ramping_vus_test: {
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
            { duration: '30s', target: 10 },
            { duration: '30s', target: 15 },
            { duration: '30s', target: 30 },
            { duration: '30s', target: 0 },
        ],
        gracefulRampDown: '0s',
        //description: 'Establece un numero de VUs creciente y decreciente, aumenta el número de VU de acuerdo con las etapas configuradas https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/'
    },
    constant_arrival_rate_test: {
        executor: 'constant-arrival-rate',
        exec: 'stockTest',
        duration: '1m',
        rate: 10,
        timeUnit: '1s',
        preAllocatedVUs: 10,
        maxVUs: 100,
        //description: 'Establece una tasa de iteraciones constante por segundo, inicia iteraciones a una tasa constante https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/'
    },
    ramping_arrival_rate_test: {
        executor: 'ramping-arrival-rate',
        exec: 'oauthAppTest',
        startRate: 1,
        timeUnit: '1s',
        preAllocatedVUs: 500,
        stages: [
            // { duration: '1m', target: 10 },
            // { duration: '0s', target: 12 },
            // { duration: '1m', target: 12 },
            { duration: '0s', target: 30 },
            { duration: '30s', target: 30 },
            { duration: '0s', target: 32 },
            { duration: '30s', target: 32 },
            { duration: '0s', target: 33 },
            { duration: '30s', target: 33 },
            { duration: '0s', target: 35 },
            { duration: '30s', target: 35 },
            // { duration: '0s', target: 78 },
            // { duration: '1m', target: 78 },
            // { duration: '0s', target: 80 },
            // { duration: '1m', target: 80 },
        ],
        //description: 'Establece una tasa de iteraciones creciente y decreciente, aumenta la tasa de iteración de acuerdo con las etapas configuradas https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/'
    }

};

const seleccionarScenario = __ENV.SCENARIO || 'constant_vus_test';

const filtrarScenarios = {};
filtrarScenarios[seleccionarScenario] = allScenarios[seleccionarScenario];

let tokenApp = '';
let tokenUser = '';
let authToken = '';

export function setup(){
    // const auth = new Auth(baseURL);
    // authToken = auth.login();

    // const oauthApp = new OauthApp();
    // tokenApp = oauthApp.loginApp();

    // // const oauthUser = new OauthUser();
    // // tokenUser = oauthUser.loginUser();
    

    // const client1 = new Client(baseURL, authToken);
    // const responseJson = JSON.stringify(client1.getClient());
    // return { authToken, responseJson};
    // //return { tokenApp, tokenUser};
}

export const options = {

    //discardResponseBodies: true,
    scenarios: filtrarScenarios,
    // vus: 10,
    // iterations:20,
    thresholds: {
        'http_req_duration': ['p(90) < 500'],
        'http_req_failed': ['rate < 1'],
    }

};

export default function () {
};

export function authTest(){  
};

export function clientTest(data){
    const client1 = new Client(baseURL, data.authToken);

    client1.pageClient(data.responseJson);

};

export function computeMethodTest(data){
    const computedMethod1 = new ComputeMethod(baseUrl, data.authToken);
    
    computedMethod1.computeOrden();
}

export function stockTest(data){

    const stockTest1 = new Stock(baseUrl2,data.authToken);
    //stockTest1.stockPost();
    console.log(stockTest1.stockPost());
}


export function validateTokenTest(data){
    
    const validateApp = new ValidateApp(data.tokenApp);
    validateApp.validateAppToken();

    // const validateUser = new ValidateUser(data.tokenUser);
    // validateUser.validateUserToken();

}

export function oauthAppTest(){
    const oauthApp = new OauthApp();
    console.log(oauthApp.loginApp());
}

export function oauthUserTest(){
    const oauthUser = new OauthUser();
    console.log(oauthUser.loginUser());
}