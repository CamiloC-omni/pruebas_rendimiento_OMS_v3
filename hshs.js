

const payload = JSON.stringify({
    "active": "true",
    "id": "6723e82e39f14314d2d935d2", //ID, No Cambiar
    "code": "PruebaVariable",  //Codigo
    "name": "TestAutomation",  //Nombre
    "type_delivery": "shipping",  //** Tipo de Entrega ----> shipping o store
    "type_picking_transfer": "consolidate", //** Tipo de transferencia de picking ---> consolidate | Partial
    "validate_warehouse_code": "optional",  //** Validacion del codigo de almacen ----> Requerido, optional, Innecesario
    "transfer_template": {
      "id": "66ed96ad0bfb7ec2ffa85088" //Plantilla de transferencia -----> Opcional
    },
    "external_id": "DELIVERY.METHOD.RULES.EDIT.TestAutomation", 
    "locality_available": {   //Division Territorial ----> Optional
      "id": "6650bf11d86f2c9c55ab3ca8"
    },
    "transfer_between_delivery_warehouses": "false",  //Transferencia entre almacenes de entrega ----> opcional
    "stock_security": {  //Stock de Seguridad por SKU ----> Opcional
      "id": "66fb0e803bb1c3f21284bce9"
    },
    "time_zone": "America/Panama", //** Zona Horaria ----> America/Panama
    "delivery_location": { //** Ubicacion de entrega ----> Compute solo considera a Stock, Solo se activa si es consolidate
      "code": "1959",
      "name": "Stock",
      "active": "",
      "external_id": "",
      "location_sql_id": "7",
      "id": "6650842ed86f2c9c55ab3c5b"
    },
    "schedule_template": {  //Plantilla de Calendario ----> Opcional
      "id": "6650baecd86f2c9c55ab3ca6"
    },
    "quantity_security": 0, //**Cantidad de Seguridad ----> 0 o mas si es necesario
    "category_template": {  //Plantilla de Categoria ----> Opcional
      "id": "67251981b68dc510bdd89a11"
    },
    "skip_delivery_location": "true", //Restringir fuente de despacho
    "delivery_warehouses": [ //**Almacenes de entrega ----> dependerá si es partial o consolidate 
      {
        "warehouse_sql_id": 7 //Si es consolidate, solo si acepta 1 almacen de entrega
      },
      {
        "warehouse_sql_id": 43// si es partial, acepta 2 o mas almacenes 
      }
    ]
  });

