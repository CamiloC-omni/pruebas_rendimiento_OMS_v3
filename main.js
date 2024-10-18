import { Auth } from './omsV3/user/Auth.js';
import { Client } from './omsV3/client/Cliente.js';
import { ComputeMethod } from './omsV3/rules/ComputeMethod.js';
import { sleep } from 'k6';
import { Stock } from './omsV3/stock/stockPrueba.js';
import { Oauth } from './omsV3/user/oauthPrueba.js';



const baseUrl = 'https://integration-core-oms-v3.omni.pro';
const baseUrl2 = 'http://apps.ourwn.co:8040';


const allScenarios = {
    shared_iterations_test: {
        executor: 'shared-iterations',
        exec:'stockTest', //Cambiar si se va a ejecutar otro
        iterations: 20,
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
        startRate: 10,
        endRate: 10,
        duration: '1m',
        timeUnit: '1s',
        preAllocatedVUs: 50,
        stages: [
            { duration: '1m', target: 10 },
            { duration: '2m', target: 600 },
            { duration: '4m', target: 600 },
            { duration: '2m', target: 100 },
        ],
        //description: 'Establece una tasa de iteraciones creciente y decreciente, aumenta la tasa de iteración de acuerdo con las etapas configuradas https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/'
    }

};

const seleccionarScenario = __ENV.SCENARIO || 'constant_vus_test';

const filtrarScenarios = {};
filtrarScenarios[seleccionarScenario] = allScenarios[seleccionarScenario];

let authToken = '';

export function setup(){
    // const auth = new Auth(baseUrl);
    // authToken = auth.token;

    const oauth1 = new Oauth();
    authToken = oauth1.token;
    
    // const client1 = new Client(baseUrl, authToken);
    // const responseJson = JSON.stringify(client1.getClient());
    
    return { authToken};
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
    
    // const auth = new Auth(baseUrl)
    // let tokenAuth = auth.token;
    // console.log(tokenAuth)
    

    

}

export function authTest(){
    const auth = new Auth(baseUrl);
    auth.login();
    
};

export function clientTest(data){
    const client1 = new Client(baseUrl, data.authToken);

    client1.pageClient(data.responseJson);

};

// export function computeMethodTest(data){
//     const computedMethod1 = new ComputeMethod(baseUrl, data.authToken);
    
//     computedMethod1.computeOrden();
// }


export function stockTest(data){

    const stockTest1 = new Stock(baseUrl2,data.authToken);
    //stockTest1.stockPost();
    console.log(stockTest1.stockPost());
}