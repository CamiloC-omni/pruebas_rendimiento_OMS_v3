import { Auth } from './omsV3/user/Auth.js';
import { Client } from './omsV3/client/Cliente.js';
import { sleep } from 'k6';



const baseUrl = 'https://integration-core-oms-v3.omni.pro';


const allScenarios = {
    shared_iterations_test: {
        executor: 'shared-iterations',
        iterations: 10,
        vus: 1,
        preAllocatedVUs: 1,
        maxDuration: '30s', 
        //description: 'Establece un numero fijo de iteraciones, comprarte iteraciones entre VUs https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/shared-iterations/'
    },
    per_vu_iterations_test: {
        executor: 'per-vu-iterations',
        //preAllocatedVUs: 1, 
        vus: 1,
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
        duration: '2m',
        rate: 10,
        timeUnit: '1s',
        preAllocatedVUs: 1,
        maxVUs: 100,
        //description: 'Establece una tasa de iteraciones constante por segundo, inicia iteraciones a una tasa constante https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/'
    },
    ramping_arrival_rate_test: {
        executor: 'ramping-arrival-rate',
        startRate: 300,
        endRate: 50,
        duration: '30s',
        timeUnit: '1m',
        preAllocatedVUs: 50,
        stages: [
            { duration: '1m', target: 300 },
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

    const auth = new Auth(baseUrl);
    authToken = auth.token

    return { authToken };
}

export const options = {

    //discardResponseBodies: true,
    scenarios: filtrarScenarios,
    // vus: 10,
    // iterations:20,
    thresholds: {
        'http_req_duration': ['p(95) < 500'],
        'http_req_failed': ['rate < 1'],
    }

};

export default function (data) {
   
    const token = data.authToken;

    const client1 = new Client(baseUrl, token);

    client1.pageClient();

}