import http from 'k6/http';
import { check, group } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function saleGet(authToken) {
    let listSale;
    group('sale_get', function(){

        const urlSale = http.url`${globalThis.baseUrlCore}/api/v1/sales/sale`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlSale, {headers: headers});

        check(response, {
            'is status 200': (r) => r.status === 200,
        });

        if(response.status === 200 ){
            listSale = JSON.parse(response.body);
        } else {
            console.error(`Error en ver clientes ${response.status}, Respuesta: ${response.body}`);
        }
    });
    return listSale;
};

export function paginateSale(authToken, listSale) {
    
    const limit = 20;
    let totalSale = 0;
    let offset;
    let salesList;
    
    
    try {
        salesList = JSON.parse(listSale);
    } catch (error) {
        console.error('Error al parsear listSale como JSON:', error, 'Contenido:', listClient);
        return;
    }

    let metaData = salesList.meta_data;

    if(!metaData || typeof metaData.total === 'undefined'){
        console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', listSale );
    }
    
    if(totalSale === 0){
        totalSale = metaData.total;
    }

    offset = randomIntBetween(1, parseInt(totalSale/limit) + 1);

    group('get_sales_paginate', function(){

        const urlSalePaginate = http.url`${globalThis.baseUrlCore}/api/v1/sales/sale?limit=${limit}&offset=${offset}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlSalePaginate, {headers: headers});

        check(response, {
            'is status 200': (r) => r.status === 200,
        });

        if(response.status === 200 ){
            console.log(`🔎 ~ Estatus: ${response.status} Ventas mostradas correctamente. Pagina --> ${JSON.stringify(urlSalePaginate)}`);
        } else {
            console.error(`❌❌ ~ Error en ver ventas ${response.status}, Respuesta: ${response.body}`);
        }

    });
};