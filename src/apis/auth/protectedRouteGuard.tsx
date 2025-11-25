import { redirect } from "@tanstack/react-router";
import type { RootRouteContext } from "../../routes/__root";

export const protectedRouteGuard = async ({
  context,
}: {
  context: RootRouteContext;
}) => {
  const { auth } = context;
  console.log(auth);
  if (auth.loading) return;

  if (!auth.firstLogin) {
    throw redirect({ to: "/" });
  }

  if (auth.firstLogin) {
    throw redirect({ to: "/onboarding" });
  }
};
