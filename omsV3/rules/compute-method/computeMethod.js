import http from "k6/http";
import { check, group, sleep } from 'k6';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Counter } from 'k6/metrics';

const exceptionsCompute = new Counter('No_coverage_in_the_address');
const warehousesCompute = new Counter('Coverage_in_the_address');
export function computeMethodPost(authToken, itemsProductos, address_code){

    let codeMap = address_code.map(item => item.code);
    let codeCorregimiento = randomItem(codeMap);
    let rangoitems = randomIntBetween(20, 35);

    let items = [];
    for (let i = 0; i < rangoitems; i++) {
        let itemsRandom = randomItem(itemsProductos);
        items.push(itemsRandom);
    }

    group('computeMethodTest', function(){
 
        const computeMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/compute-method`;

        const requestBody = JSON.stringify({
            "data": [
              {
                "shippingDetails": {
                  "address": {
                    "territorial_division": {
                      "code": codeCorregimiento,
                      "level": "pa_corregimiento"
                    }
                  },
                  "method": {
                    "code": "PruebaVariable",
                    "warehouse_code": "1959"
                  }
                },
                "items":  items
                
              }
            ]
          });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept' : 'application/json'
        }

        const response = http.post(computeMethodUrl, requestBody, {headers:headers});

        let assertCompute = check(response, {
            'is status 201': (r) => r.status === 201,
        });

        if ( assertCompute ) {
            console.log(`🚀🚀 ~ Respuesta obtenida de Compute-Method: ${response.status}`);
            let body = JSON.parse(response.body);
            let warehousesOk = body.result[0].warehouses
            let exceptionsOk = body.result[0].exceptions
            
            
            if(warehousesOk.length > 0 ){
              console.log(`Resultado: ${JSON.stringify(warehousesOk)}, En el territorial_division: ${codeCorregimiento}`);
              warehousesCompute.add(1);
            
            } else if(exceptionsOk[0] === "No coverage in the address") {
              console.log(`Resultado: ${exceptionsOk}, En el territorial_division: ${codeCorregimiento}`)
              exceptionsCompute.add(1)
            } else if (warehousesOk.length === 0 && exceptionsOk.length === 0){
              console.log(`Resultado: Sin resultados, Sin Stock, En el territorial_division: ${codeCorregimiento}`);
            }
            
    
        } else {
            console.log(`❌❌ ~ Error al obtener la respuesta en Compute-Method: ${response.status}, ${response.body}, ${response.request.body}`);
        }
    });
};

/** ----------------------------------------------------------------------------------------------------------------- */

/** ----------------------------------------------------------------------------------------------------------------- */

const payloadBase = {
    "data": [
      {
        "shippingDetails": {
          "address": {
            "territorial_division": {
              "code": "0317",
              "level": "pa_corregimiento"
            }
          },
          "method": {
            "code": "PruebaVariable",
            "warehouse_code": "1959"
          }
        },
        "items": [
          {
            "price_unit": 2.55,
            "quantity": 1,
            "sku": "10100555"
          },
          {
            "price_unit": 0.35,
            "quantity": 1,
            "sku": "20100834"
          },
          {
              "price_unit": 2.55,
              "sku": "20084197",
              "quantity": 1    
          } 
      ]
    }
  ]
};

/** ------------------------------------ ESCENARIOS ---------------------------------------------------*/

function computeSinAddress(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  delete payload.data[0].shippingDetails.address
  return payload;
};

function computeSinItems(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].items = [];
  return payload;
};

function computeItemSinSku(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].items[0].sku = "";
  return payload;
};

function computeItemSinPriceUnit(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].items[0].price_unit = 0;
  return payload;
};

function computeItemSinQuantity(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].items[0].quantity = 0;
  return payload;
};

function computeSinCodeTerritorialDivision(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].shippingDetails.address.territorial_division.code = "";
  return payload;
};

function computeSinLevelTerritorialDivision(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].shippingDetails.address.territorial_division.level = "";
  return payload;
};

function computeSinCodeMethod(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].shippingDetails.method.code = "";
  return payload;
};

function computeSinWarehouseCode(){
  const payload = JSON.parse(JSON.stringify(payloadBase));
  payload.data[0].shippingDetails.method.warehouse_code = "";
  return payload;
};



const scenariosCompute = [
  {name: 'Compute Base', payload: payloadBase, expectedStatuses: 201},
  {name: 'Compute sin Adrress', payload: computeSinAddress(), expectedStatuses: 400},
  {name: 'Compute sin Items', payload: computeSinItems(), expectedStatuses: 500},
  {name: 'Compute Item sin SKU', payload: computeItemSinSku(), expectedStatuses: 201},
  {name: 'Compute Item sin Price Unit', payload: computeItemSinPriceUnit(), expectedStatuses: 201},
  {name: 'Compute Item sin Quantity', payload: computeItemSinQuantity(), expectedStatuses: 201},
  {name: 'Compute sin Code Territorial Division', payload: computeSinCodeTerritorialDivision(), expectedStatuses: 201},
  {name: 'Compute sin Level Territorial Division', payload: computeSinLevelTerritorialDivision(), expectedStatuses: 201},
  {name: 'Compute sin Code Method', payload: computeSinCodeMethod(), expectedStatuses: 201},
  {name: 'Compute sin Warehouse Code', payload: computeSinWarehouseCode(), expectedStatuses: 201}

];


export function computeMethodScenarios(authToken){

  const computeMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/compute-method`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    'accept' : 'application/json'
  }


  for(const scenarios of scenariosCompute){
    
      
    const response = http.post(computeMethodUrl, JSON.stringify(scenarios.payload), {headers:headers});
    
    
    check(response, {
      [`${scenarios.name} es Status ${scenarios.expectedStatuses}`]: (r) => r.status === scenarios.expectedStatuses,
      [`${scenarios.name}`]: (r) => {
          try {
              const json = JSON.parse(r.body);
              const result = json.result; 
              if (Array.isArray(result) && result.length > 0) {
                const warehouses = result[0].warehouses; 
                const exceptions = result[0].exceptions;

                  if (warehouses.length > 0) {
                    return true;
                  } else if (exceptions.length > 0) {
                  return false;
                  } else if (warehouses.length === 0 && exceptions.length === 0) {
                    return true;
                  }
              }
              return false;
          } catch (e) {
              return false;
          }
      },
    });

    if (response.status === 201) {
      const body = JSON.parse(response.body);
      const warehouses = body.result[0].warehouses;
      const exceptions = body.result[0].exceptions;
        if (warehouses.length > 0) {
          console.log(`✅✅ ~ Escenario: ${scenarios.name}, Almacenes obtenidos: ${JSON.stringify(warehouses)}`);
        }
        if (exceptions.length > 0) {
          console.log(`✅❌ ~ Escenario: ${scenarios.name}, Excepciones obtenidas: ${exceptions}`);
        }
    } else {
      console.log(`❌❌ ~ Escenario: ${scenarios.name}, Error al obtener la respuesta en Compute-Method: ${response.status}, ${response.body}`);
    };

    sleep(1);
  };

   
};