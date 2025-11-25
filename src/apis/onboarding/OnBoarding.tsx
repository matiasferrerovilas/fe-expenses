import { api } from "../axios";

export interface OnboardingForm {
  amount: number;
  bank: string;
  currency: string;
  groups: string[];
  gastosIniciales: number;
}

export async function getIsFirstLogin() {
  return api
    .get<boolean>("/onboarding/is-first")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching services:", error);
      throw error;
    });
}
export async function finishOnboarding(form: OnboardingForm) {
  console.log("Finishing onboarding with data:", form);
  return api
    .post("/onboarding", form)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error finishing onboarding:", error);
      throw error;
    });
}
