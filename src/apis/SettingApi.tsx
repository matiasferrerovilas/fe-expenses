import type { LastIngreso } from "../models/Movement";
import type { IngresoSettingForm } from "../models/Settings";
import { api } from "./axios";

export async function getLastIngreso() {
  return api
    .get<LastIngreso>("/settings/last-ingreso")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function updateIngreso(ingreso: IngresoSettingForm) {
  return api
    .post("/settings", ingreso)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
