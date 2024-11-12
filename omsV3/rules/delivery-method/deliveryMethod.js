import http from 'k6/http';
import { check, group, sleep } from 'k6';


const deliveryMethodUrl = `${globalThis.baseUrlCore}/api/v1/rules/delivery-method`;

export function deliveryMethodGet(authToken) {

    const dmUrlGet = `${deliveryMethodUrl}?id=6723e82e39f14314d2d935d2`;
    
    group('delivery_method', function(){
    
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'accept' : 'application/json'
        }
    
        const response = http.get(dmUrlGet, { headers: headers });

        check(response, {
            'status is 200': response.status === 200,
            'response body has delivery methods': response.json('data.delivery_methods')!== null,
        });

        console.log(`🚀🚀 ~ Respuesta obtenida de Delivery-Method: ${response.status}`);
        console.log(response.body);

    });
};

/** ------------------------------------------------------------------------------------------------------- */

/** ------------------------------------------------------------------------------------------------------- */


let payloadBase = {
    "active": true,
    "id": "6723e82e39f14314d2d935d2", //ID, No Cambiar
    "name": "TestAutomation", //Nombre, No Cambiar
    "code": "PruebaVariable", //Codigo, No Cambiar
    "time_zone": "America/Panama", //** Zona Horaria ----> America/Panama
    "delivery_warehouses": [ //**Almacenes de entrega ----> dependerá si es partial o consolidate
        { "warehouse_sql_id": 1 } //Si es consolidate, solo si acepta 1 almacen de entrega
        //{ "warehouse_sql_id": 34} // si es partial, acepta 2 o mas almacenes 
    ],
    "delivery_location": { //** Ubicacion de entrega ----> Compute solo considera a Stock, Solo se activa si es consolidate
        "code": "1959",
        "name": "Stock",
        "active": true,
        "external_id": "",
        "location_sql_id": 7,
        "id": "6650842ed86f2c9c55ab3c5b"
    },
    "type_delivery": "shipping", //** Tipo de Entrega ----> shipping(Envio) o store(Tienda)
    "type_picking_transfer": "consolidate", //** Tipo de transferencia de picking ---> consolidate(Un solo almacen) o Partial(varios almacenes)
    "validate_warehouse_code": "required", //** Validacion del codigo de almacen ----> Requerido, optional, Innecesario
    "quantity_security": 0, //**Cantidad de Seguridad Global ----> 0 o mas si es necesario 
    "stock_security": { "id": "" }, //Stock de Seguridad por SKU ----> Opcional
    "transfer_between_delivery_warehouses": false, //Transferencia entre almacenes de entrega ----> solo es valido si hay mas de dos almacenes de entrega
    "skip_delivery_location": false, //Restringir fuente de despacho
    "transfer_template": { "id": "" }, //Plantilla de transferencia -----> Opcional comparte stock con los almecenes seleccionados en la plantilla de transferencia
    "schedule_template": { "id": "" }, //Plantilla de Calendario ----> Opcional modifica los horarios y fechas de entrega segun la plantilla
    "category_template": { "id": "" }, //Plantilla de Categoria ----> Opcional solo habilita el tipo de categoria disponible en la plantilla
    "locality_available": { "id": "" }, //Division Territorial ----> Optional habilita el stock dependiendo la division territorial o si es shipping habilita la cobertura de entrega
    "external_id": "DELIVERY.METHOD.RULES.EDIT.TestAutomation"
};


//**----------------------------------- ESCENARIOS -------------------------------------------------------------------------------------------- */

function datosFaltantes(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    delete payload.delivery_warehouses;
    delete payload.delivery_location;
    return payload;
};

function deliveryErroneo(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.delivery_warehouses = [
        { "warehouse_sql_id": 2 }
    ];
    return payload;
};


function deliverySinStock(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.delivery_location = {};
    return payload;
};

//Este escenario arrojará un error 400 ya que consolidate acepta UN(1) solo almacen de entrega 
function consolidateConDosAlmecenes(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.delivery_warehouses = [
        { "warehouse_sql_id": 1 },
        { "warehouse_sql_id": 34 }
    ];
    return payload;
};

//Este escenario arrojará un error ya que transfer_between_delivery_warehouses es true y solo se puede usar cuando hay mas de dos almacenes de entrega
function consolidateConUnoAlmacenYTBDW(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.transfer_between_delivery_warehouses = true;
    return payload;
};

//Este Escenario Restringe todo el stock
function consolidateConSkipDL(){ 
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.skip_delivery_location = true;
    return payload;
};

//Este Escenario Restringe globalmente el stock, segun la cantidad que se indique
function consolidateConQuantitySecurity(){
    let payload =JSON.parse(JSON.stringify(payloadBase));
    payload.quantity_security = 999;
    return payload;
};

//Este Escenario Restringe el stock por SKU segun la plantilla escogida
function consolidateConStockSecurity(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.stock_security = { "id": "66fb0e803bb1c3f21284bce9" };
    return payload;
};

//Este escenario coloca la plantilla de transferencia
function consolidateConPlantillaTransferencia(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.transfer_template = { "id": "66ed96ad0bfb7ec2ffa85088" };
    return payload;
}

//Este escenario coloca la plantilla de calendario
function consolidateConPlantillaCalendario(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.schedule_template = { "id": "6650baecd86f2c9c55ab3ca6" };
    return payload;
};

//Este escenario coloca la plantilla de categoria
function consolidateConPlantillaCategoria(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.category_template = { "id": "67251981b68dc510bdd89a11" };
    return payload;
};

//Este escenario coloca la division territorial Zona Cubierta Domicilio
function consolidateConDTZonaCubiertaDomicilio(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.locality_available = { "id": "6650bf11d86f2c9c55ab3ca9" };
    return payload;
};

//Este escenario coloca la division territorial El Faro
function consolidateConDTElFaro(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.locality_available = { "id": "6650bfe5d86f2c9c55ab3cab" };
    return payload;
};

//Este Escenario ajusta tipo de picking a partial y solo un almacen de entrega
function partialConUnAlmacenEntrega(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.type_picking_transfer = "partial";
    return payload;
};

//Este Escenario ajusta tipo de picking a partial y dos almacenes de entrega
function partialConDosAlmacenesEntrega(){
    let payload = JSON.parse(JSON.stringify(payloadBase));
    payload.delivery_warehouses = [
        { "warehouse_sql_id": 1 },
        { "warehouse_sql_id": 34 }
    ];
    payload.type_picking_transfer = "partial";
    return payload;
};



function partialConCincoAlmacenes(){
    let payload =JSON.parse(JSON.stringify(payloadBase));
    payload.delivery_warehouses = [
            {
                "warehouse_sql_id": 1
            },
            {
                "warehouse_sql_id": 2
            },
            {
                "warehouse_sql_id": 3
            },
            {
                "warehouse_sql_id": 4
            },
            {
                "warehouse_sql_id": 34
            }
    ];
    payload.type_picking_transfer = "partial";
    return payload;
};


export const scenariosDeliveryMethod = [
    { scenario: 'Delivery Method Scenario Base', payload: payloadBase, expectedStatuses: 200 },
    { scenario: 'Delivery Method Datos Faltantes', payload: datosFaltantes(), expectedStatuses: 400 },
    { scenario: 'Delivery Method Delivery Erroneo', payload: deliveryErroneo(), expectedStatuses: 400 },
    { scenario: 'Delivery Method Delivery Sin Stock', payload: deliverySinStock(), expectedStatuses: 400 },
    { scenario: 'Delivery Method Consolidate con Dos Almacenes', payload: consolidateConDosAlmecenes(), expectedStatuses: 400 },
    { scenario: 'Delivery Method Consolidate con Uno Almacen y TBDW', payload: consolidateConUnoAlmacenYTBDW(), expectedStatuses: 400 },
    { scenario: 'Delivery Method Consolidate con SkipDL', payload: consolidateConSkipDL(), expectedStatuses: 200},
    { scenario: 'Delivery Method Consolidate con QuantitySecurity', payload: consolidateConQuantitySecurity(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con StockSecurity', payload: consolidateConStockSecurity(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con Plantilla Transferencia', payload: consolidateConPlantillaTransferencia(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con Plantilla Calendario', payload: consolidateConPlantillaCalendario(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con Plantilla Categoria', payload: consolidateConPlantillaCategoria(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con DT Zona Cubierta Domicilio', payload: consolidateConDTZonaCubiertaDomicilio(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Consolidate con DT El Faro', payload: consolidateConDTElFaro(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Partial con Un Almacen Entrega', payload: partialConUnAlmacenEntrega(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Partial con Dos Almacenes Entrega', payload: partialConDosAlmacenesEntrega(), expectedStatuses: 200 },
    { scenario: 'Delivery Method Partial con Cinco Almacenes', payload: partialConCincoAlmacenes(), expectedStatuses: 200 },
];



//Esta funcion envia el Put para actualizar y recibe el token de autenticacion
export function deliveryMethodPut(authToken, scenarioTest) {
    
    const urlDeliveryMethod = http.url`${globalThis.baseUrlCore}/api/v1/rules/delivery-method`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'accept': 'application/json',
    };

    return http.put(urlDeliveryMethod, JSON.stringify(scenarioTest), { headers: headers });
    
};
        