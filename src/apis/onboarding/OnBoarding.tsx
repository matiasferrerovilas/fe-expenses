import { api } from "../axios";

export interface OnboardingForm {
  bank: string;
  currency: string;
  groups: string[];
  onBoardingAmount: {
    amount: number;
    group: string;
  };
}

export interface OnboardingIngresoForm {
  bank: string;
  currency: string;
  group: string;
  amount: number;
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
  return api
    .post("/onboarding", form)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error finishing onboarding:", error);
      throw error;
    });
}
