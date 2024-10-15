import { sleep } from "k6";
import http from "k6/http";

//Carga media pero a un tiempo prolongado
export const options = {
  stages: [
    {
      duration: "2m",
      target: 200,
    },
    {
      duration: "3h30m",
      target: 200,
    },
    {
      duration: "2m",
      target: 0,
    },
  ],
};

export default function () {
  let response = http.get("https://api.escuelajs.co/api/v1/products");
}
