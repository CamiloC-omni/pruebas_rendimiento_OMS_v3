import {SharedArray} from "k6/data";
import { auth } from './omsV3/user/auth.js';
import { client, pageClient } from './omsV3/client/cliente.js';
import { computeMethod } from './omsV3/rules/computeMethod.js';
import { stock } from './appDjango/stockPrueba.js';
import { oauthApp } from './appDjango/oauthApp.js';
import { oauthUser } from './appDjango/oauthUser.js'
import { validateAppToken } from './appDjango/validateApp.js';
import { validacionTokenUser } from './appDjango/validateUser.js';
import { config } from './config/config.js';
import { kanban } from "./omsV3/stock/picking/kanban/kanban.js";
import { validatePicking } from "./omsV3/stock/picking/validate-picking/validatePicking.js";
import { addQuantity } from "./omsV3/stock/stock_move_line/addQuantity.js";

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


const itemsProductos = new SharedArray('Items Data', function() {
    return JSON.parse(open('./data/product_items.json'));
});

const codesIdArray = new SharedArray('codes_Id', function() {
    return JSON.parse(open('./data/codesid.json'));
});

const codesIdPicking = new SharedArray('codes_Id', function() {
    return JSON.parse(open('./data/picking_id.json')); 
});

const stockQuantity = new SharedArray('stock_quantity', function() {
    return JSON.parse(open('./data/stock_qqtty.json'));
});

const stockAppArray = new SharedArray("stock", function () {
    return JSON.parse(open("./data/stock.json"));
});


// Comando para ejecutar: docker compose run --rm k6 run --config /scripts/options/share_iterations_default.json /scripts/main.js

export function setup(){

    // let tokenApp = oauthApp();
    // let tokenUser = oauthUser();

    let authToken = auth();
    // let listClient = JSON.stringify(client(authToken));
    return { authToken };
    // return {  tokenApp, tokenUser };
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
    computeMethod(data.authToken, itemsProductos);
};

export function pickingKanbanTest(data){
    kanban(data.authToken, codesIdArray);
};

export function addQuantityTest(data){
    addQuantity(data.authToken, stockQuantity);
};

export function validatePickingTest(data){
    validatePicking(data.authToken, codesIdPicking);
};

export function stockTest(data){
    stock(data.tokenApp, stockAppArray);
};

export function validateTokenTest(data){
    // validateAppToken(data.tokenApp);
    // validacionTokenUser(data.tokenUser);
}
