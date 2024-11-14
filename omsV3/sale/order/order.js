import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Counter } from 'k6/metrics';

export function orderGet(authToken) {
    let listOrder;
    group('order_get', function(){

        const urlOrder = http.url`${globalThis.baseUrlCore}/api/v1/sales/order`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlOrder, {headers: headers});

        check(response, {
            'is status 200': (r) => r.status === 200,
        });

        if(response.status === 200 ){
            listOrder = JSON.parse(response.body);
        } else {
            console.error(`Error en ver Ordenes ${response.status}, Respuesta: ${response.body}`);
        }
    });
    return listOrder;
};


export const errorOrder = Counter('Error_Order');

export function paginateOrder(authToken) {
    
    const limit = 20;
    const totalOrder = 1535;

    //**---Este fragmento de codigo es para extraer el total de Orders(Ordenes)  --- */
    // let orderList;
    
    
    // try {
    //     orderList = JSON.parse(listOrder);
    // } catch (error) {
    //     console.error('Error al parsear listSale como JSON:', error, 'Contenido:', listOrder);
    //     return;
    // }

    // let metaData = orderList.meta_data;

    // if(!metaData || typeof metaData.total === 'undefined'){
    //     console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', listOrder );
    // }

    // if(totalOrder === 0){
    //     totalOrder = metaData.total;
    // }

    let offset = randomIntBetween(1, parseInt(totalOrder/limit) + 1);

    group('get_order_paginate', function(){

        try {
            const urlOrderPaginate = http.url`${globalThis.baseUrlCore}/api/v1/sales/order?limit=${limit}&offset=${offset}`;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'accept': 'application/json',
            };

            const response = http.get(urlOrderPaginate, {headers: headers});

            let assertOrder = check(response, {
                'is status 200': (r) => r.status === 200,
            });

            if(assertOrder){
                console.log(`🔎📦 ~ Estatus: ${response.status} Order mostrada correctamente. Pagina: ${offset}`);
            } else {
                console.error(`❌📦 ~ Error en ver Order ${response.status}, Respuesta: ${response.body}, Pagina: ${offset}`);
                errorOrder.add(1);
            };

        } catch (error) {
            console.error(`❌❌ ~ Error en Order ${error}, Respuesta: ${error.message}, Pagina: ${offset}`);
            errorOrder.add(1);
        }
        
        sleep(1);
    });
};