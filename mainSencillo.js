import { auth } from './omsV3/user/auth.js';
import { client, pageClient } from './omsV3/client/cliente.js';
import { computeMethod } from './omsV3/rules/computeMethod.js';
import { stock } from './omsV3/stock/stockPrueba.js';
import { oauthApp } from './appDjango/oauthApp.js';
import { oauthUser } from './appDjango/oauthUser.js'
import { validateAppToken } from './appDjango/validateApp.js';
import { validacionTokenUser } from './appDjango/validateUser.js';
import { config } from './config/config.js';

globalThis.baseUrlCore = config.baseURLCore;
globalThis.baseUrlApp = config.baseURLDjango;

globalThis.clientIdCore = config.clientId;
globalThis.clientSecretCore = config.clientSecret;
globalThis.tenant = config.tenant;

globalThis.clientIdOauth = config.clientIdDjango;
globalThis.clientSecretOauth = config.clientSecretDjango;

globalThis.clientEmailUser = config.clientEmail;
globalThis.clientPass = config.clientPassword;


const allScenarios = {
    shared_iterations_test: {
        executor: 'shared-iterations',
        exec:'stockTest', //Cambiar si se va a ejecutar otro
        iterations: 1,
        vus: 1,
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
            { duration: '0s', target: 30 },
            { duration: '30s', target: 30 },
            { duration: '0s', target: 32 },
            { duration: '30s', target: 32 },
            { duration: '0s', target: 33 },
            { duration: '30s', target: 33 },
            { duration: '0s', target: 35 },
            { duration: '30s', target: 35 },
            
        ],
        //description: 'Establece una tasa de iteraciones creciente y decreciente, aumenta la tasa de iteración de acuerdo con las etapas configuradas https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/'
    }

};

// EJECUTAR --> docker compose run --rm -e SCENARIO=shared_iterations_test k6 run /scripts/main.js

const seleccionarScenario = __ENV.SCENARIO || 'constant_vus_test';

const filtrarScenarios = {};
filtrarScenarios[seleccionarScenario] = allScenarios[seleccionarScenario];


export function setup(){

    let tokenApp = oauthApp();
    // let tokenUser = oauthUser();

    // let authToken = auth();
    // let listClient = JSON.stringify(client(authToken));
    // return { authToken };
    return {  tokenApp };
}

export const options = {

    //discardResponseBodies: true,
    scenarios: filtrarScenarios,
    
    thresholds: {
        'http_req_duration': ['p(90) < 500'],
        'http_req_failed': ['rate < 1'],
    }

};

export default function () {
};

export function authTest(){
    auth();
};

export function oauthAppTest(){
    oauthApp();
}

export function oauthUserTest(){
    oauthUser();
}

export function clientTest(data){
    pageClient(data.authToken, data.listClient);
};

export function computeMethodTest(data){
}

export function stockTest(data){
    stock(data.tokenApp);
}

export function validateTokenTest(data){
    validateAppToken(data.tokenApp);
    // validacionTokenUser(data.tokenUser);
}