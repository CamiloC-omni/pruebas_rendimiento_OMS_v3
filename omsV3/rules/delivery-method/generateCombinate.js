

export function generateCombinations() {
    const combinations = [];

    const delivery_warehouses = [
        [
            { "warehouse_sql_id": 1 },
            { "warehouse_sql_id": 34 }
        ],
        [
            { "warehouse_sql_id": 1 }
        ]
        
    ];
    const type_delivery = ["shipping", "store"];
    const validate_warehouse_code = ["required", "optional", "unnecessary"];
    const stock_security = ["","66fb0e803bb1c3f21284bce9"];
    const transfer_between_delivery_warehouses = [true, false];
    const transfer_template = ["","66ed96ad0bfb7ec2ffa85088"];
    const schedule_template = ["","6650baecd86f2c9c55ab3ca6"];
    const category_template = ["","67251981b68dc510bdd89a11"];
    const locality_available = ["","66bba04d2754a946b2d0e104", "6650bf11d86f2c9c55ab3ca9"];
    
    const defaultValores = {
        delivery_warehouses: delivery_warehouses[0],
        quantity_security: 0,
        stock_security: stock_security[0],
        transfer_between_delivery_warehouses: false,
        skip_delivery_location: false,
    };
    
    
    for(const transferBetween of transfer_between_delivery_warehouses){    
        for (const delivery of type_delivery) {          
            for (const warehouseCode of validate_warehouse_code) {  
                for (const transferTemp of transfer_template) {
                    for (const scheduleTemp of schedule_template) {
                        for (const categoryTemp of category_template) {
                            for (const locality of locality_available) {     
                                
                                    
                                const config = {
                                    delivery_warehouses: warehauses,
                                    type_delivery: delivery,
                                    validate_warehouse_code: warehouseCode,
                                    quantity_security: defaultValores.quantity_security,
                                    stock_security: defaultValores.stock_security,
                                    transfer_between_delivery_warehouses: transferBetween,
                                    skip_delivery_location: defaultValores.skip_delivery_location,
                                    transfer_template: transferTemp,
                                    schedule_template: scheduleTemp,
                                    category_template: categoryTemp,
                                    locality_available: locality,
                                };
                                combinations.push(config);

                                    
                            }
                        }
                    }
                }                  
            }    
        }     
    }
    
    
    return combinations;
};


