import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 20,
  duration: "20s",
  thresholds: {
    http_req_duration: [
      {
        thresholds: "p(95)<500",

      },
    ],
    http_req_failed: ["rate<0.35"],
  },
};

export default function () {
  const response = http.get("https://integration-core-oms-v3.omni.pro");
  check(response, {
    "status is 200": (r) => r.status === 200,
    "transaction is below 500ms": (r) => r.timings.duration < 500,
  });
}