import { check, fail } from "k6";

export function checkResponse(response) {
  if (response) {
    if (response.status === 200) {
        check(response, {
            "is status 200": (r) => r.status === 200,
            [`http_req_duration <= ${globalThis.thresholds_http_req_duration_ms} ms`]:
                (r) => r.timings.duration < globalThis.thresholds_http_req_duration_ms,
            });
    } else {
      check(response, {
          [`is status ${response.status}`]: (r) => {
          if (!r.status === 200) {
            fail(`❌❌ ~ Error en la respuesta: ${response.status}, ${response.body}`);
          }
          //console.info(`is status ${r.status} `, response);
          },
      });
    }
  } else {
    check(response, {
      "undefined error": (r) => {
        if (!r) {
          console.log("undefined error", response);
        }
      },
    });
  }
}