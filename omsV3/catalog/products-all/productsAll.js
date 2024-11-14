import http from 'k6/http';
import { check, group,sleep } from 'k6';
import { randomIntBetween,  } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Counter } from 'k6/metrics';

export function productsAllGet(authToken){
    let listProducts;
    group('products_all_get', function(){
        
        const urlProducts = http.url`${globalThis.baseUrlCore}/api/v1/catalog/products-all`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
        };

        const response = http.get(urlProducts, {headers: headers});

        check(response, {
            'Es status 200': (r) => r.status === 200,
        });

        if(response.status === 200 ){
            listProducts = JSON.parse(response.body);
        } else {
            console.error(`Error en ver Productos ${response.status}, Respuesta: ${response.body}`);
            return;
        }
    });
    return listProducts;
};

export const errorProducto = Counter('Error_Producto');

export function productsAllPagination(authToken){

    const limit = 20;
    const totalProducts = 22646;
    
    //**--- Este fragmento de codigo es para extraer el total de Productos --- */

    // let listProduct;
    // try {
    //     listProduct = JSON.parse(listProducts);
    // } catch (error) {
    //     console.error('Error al parsear listSale como JSON:', error, 'Contenido:', listProducts);
    //     return;
    // }

    // let metaData = listProduct.meta_data;

    // if(!metaData || typeof metaData.total === 'undefined'){
    //     console.error('Error: meta_data o meta_data.total no está presente en la respuesta. Respuesta:', listProduct );
    // }
    
    // if(totalProducts === 0){
    //     totalProducts = metaData.total;
    // }

    let offset = randomIntBetween(1, (totalProducts/limit) + 1);
    
    
    group('products_all_pagination', function(){


        try {
            const urlProducts = http.url`${globalThis.baseUrlCore}/api/v1/catalog/products-all?limit=${limit}&offset=${offset}`;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'accept': 'application/json',
            };

            const response = http.get(urlProducts, {headers: headers});

            let assertProduct = check(response, {
                'Es status 200': (r) => r.status === 200,
            });

            if(assertProduct ){
                console.log(`🔎🧴 ~ Estatus: ${response.status} Productos mostradas correctamente. Pagina: ${offset}`);
            }else{
                console.error(`❌🧴 ~ Error en buscar Productos ${response.status}, Respuesta: ${response.body}, Pagina: ${offset}`);
                errorProducto.add(1);
            };

        } catch (error) {
            console.error(`❌❌ ~ Error en Producto ${error}, ${error.message}`);
            errorProducto.add(1);
        }
        
        sleep(1);
    });

};