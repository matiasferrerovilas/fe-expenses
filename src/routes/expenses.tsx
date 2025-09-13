import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { getExpenseApi } from "../apis/ExpenseApi";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ExpenseTable from "../components/expenses/ExpenseTable";

export const Route = createFileRoute("/expenses")({
  component: RouteComponent,
});

const PENDING_FACES_QUERY_KEY = ["expenses"] as const;
const DEFAULT_PAGE_SIZE = 25;

const createExpenseFactoryQuery = (
  page: number,
  size: number = DEFAULT_PAGE_SIZE
) =>
  queryOptions({
    queryKey: [...PENDING_FACES_QUERY_KEY, page, size],
    queryFn: () => getExpenseApi(page, size),
    staleTime: 5 * 60 * 1000,
  });

function usePagination() {
  const [page, setPage] = useState(0);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  return {
    page,
    nextPage,
    prevPage,
    canGoPrev: page > 0,
  };
}

function RouteComponent() {
  const { page, nextPage, prevPage, canGoPrev } = usePagination();

  const queryConfig = useMemo(
    () => createExpenseFactoryQuery(page, DEFAULT_PAGE_SIZE),
    [page]
  );
  const { data } = useSuspenseQuery(queryConfig);

  const expenses = data?.content ?? [];

  return (
    <div>
      <h1>Gastos</h1>
      <ExpenseTable
        expenses={expenses}
        page={page}
        nextPage={nextPage}
        prevPage={prevPage}
        canGoPrev={canGoPrev}
        totalElements={data.totalElements}
        pageSize={DEFAULT_PAGE_SIZE}
      />
    </div>
  );
}
