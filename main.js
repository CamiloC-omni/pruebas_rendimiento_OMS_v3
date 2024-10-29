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

globalThis.thresholds_http_req_duration_ms = 1000;



export function setup(){

    let tokenApp = oauthApp();
    let tokenUser = oauthUser();

    // let authToken = auth();
    // let listClient = JSON.stringify(client(authToken));
    // return { authToken };
    return {  tokenApp, tokenUser };
}

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
    validacionTokenUser(data.tokenUser);
}
