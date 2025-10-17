import type { Service } from "../models/Service";
import { api } from "./axios";

export async function getServicesApi() {
  return api
    .get<Service[]>("/services")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching services:", error);
      throw error;
    });
}

export async function payServiceApi(service: Service) {
  console.log(service);
  return api
    .patch("/services/pay/" + service.id)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating services:", error);
      throw error;
    });
}
