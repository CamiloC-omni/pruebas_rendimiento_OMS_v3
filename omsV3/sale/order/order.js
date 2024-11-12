import http from 'k6/http';
import { check, group } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

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

export function paginateOrder(authToken, listOrder) {
    
    const limit = 20;
    let totalOrder = 0;
    let offset;
    let orderList;
    
    
    try {
        orderList = JSON.parse(listOrder);
    } catch (error) {
        console.error('Error al parsear listSale como JSON:', error, 'Contenido:', listOrder);
        return;
    }

    let metaData = orderList.meta_data;

    if(!metaData || typeof metaData.total === 'undefined'){
        console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', listOrder );
    }
    
    if(totalOrder === 0){
        totalOrder = metaData.total;
    }

    offset = randomIntBetween(1, parseInt(totalOrder/limit) + 1);

    group('get_order_paginate', function(){

        const urlOrderPaginate = http.url`${globalThis.baseUrlCore}/api/v1/sales/order?limit=${limit}&offset=${offset}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlOrderPaginate, {headers: headers});

        check(response, {
            'is status 200': (r) => r.status === 200,
        });

        if(response.status === 200 ){
            console.log(`🔎 ~ Estatus: ${response.status} Ordenes mostradas correctamente. Pagina --> ${JSON.stringify(urlOrderPaginate)}`);
        } else {
            console.error(`❌❌ ~ Error en ver ventas ${response.status}, Respuesta: ${response.body}`);
        }

    });
};