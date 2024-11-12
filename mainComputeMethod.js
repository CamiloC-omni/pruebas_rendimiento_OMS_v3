import http from 'k6/http';
import { auth } from "./omsV3/user/auth.js";
import { deliveryMethodPatch } from './omsV3/rules/delivery-method/deliveryMethod.js';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { config } from './config/config.js';


export function setup(){
    let authToken = auth();
    return { authToken };
};

globalThis.baseUrlCore = config.baseURLCore;
globalThis.thresholds_http_req_duration_ms = 1000;

const computeMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/compute-method`;
const deliveryMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/delivery-method`;

// export function delivery_methodPath(data){
//     deliveryMethodPatch(deliveryMethodUrl,data.authToken);
// };



// export function computeMethod(data){
    
//     const items = [{
//         "price_unit": 1.65,
//         "quantity": 1,
//         "sku": "20041375"
//       },
//       {
//         "price_unit": 3.21,
//         "quantity": 1,
//         "sku": "20144361"
//       }];
    
    
//     const requestBody = JSON.stringify({
//         "data": [
//           {
//             "shippingDetails": {
//               "address": {
//                 "territorial_division": {
//                   "code": "1971",
//                   "level": "pa_corregimiento"
//                 }
//               },
//               "method": { //** Metodo de entrega ----> Cambiara sus reglas por cada iteracion 
//                 "code": "Domicilio2", // Nombre del metodo, No Cambiar
//                 "warehouse_code": "1959" //Codigo de almacen ----> Opcional si en el metodo es requerido o no, segun la tienda
//               }
//             },
//             "items": items
//           }
//         ]
//       });

// }