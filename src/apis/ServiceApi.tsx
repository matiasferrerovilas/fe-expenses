import type { CurrencyRecord } from "../models/Currency";
import type { Service } from "../models/Service";
import { api } from "./axios";

export interface ServiceToAdd {
  amount: number;
  description: string;
  currency: CurrencyRecord;
  lastPayment: Date | null;
  isPaid: boolean;
}
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
  return api
    .patch("/services/pay/" + service.id)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating services:", error);
      throw error;
    });
}
export async function addServiceApi(service: ServiceToAdd) {
  return api
    .post("/services", service)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating services:", error);
      throw error;
    });
}
