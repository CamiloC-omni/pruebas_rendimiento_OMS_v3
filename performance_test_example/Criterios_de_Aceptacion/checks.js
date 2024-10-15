import { check } from "k6";
import http from "k6/http";

export const options = {
    vus: 20,
    duration: "20s",
    
  };
export default function () {
  const response = http.get("https://integration-core-oms-v3.omni.pro");

  //Vallidamos cada una de las iteraciones y en dado que no se cumpla el test sigue funcionando
  check(response, {
    //valida que el estatus de la pagina sea 200
    "statusCode is 200": (r) => r.status === 200,

    //valida que la duracion de la transaccion sea menor a 500ms
    "transaction is below 500ms": (r) => r.timings.duration < 500,
  });
}
