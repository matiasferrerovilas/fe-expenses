import { Suspense, type ReactNode } from "react";

type QueryLoadingBoundaryProps = {
  children: ReactNode;
};

export const QueryLoadingBoundary = ({
  children,
}: QueryLoadingBoundaryProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-64"></div>
      }
    >
      {children}
    </Suspense>
  );
};
