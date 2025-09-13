import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { getExpenseApi } from "../apis/ExpenseApi";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { Expense } from "../models/Expense";

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

const columns = [
  {
    title: "Fecha",
    dataIndex: "dateTime",
    key: "dateTime",
    width: "1%",
    align: "left",

    render: (dateTime: string) => new Date(dateTime).toLocaleDateString(),
  },
  {
    title: "Año",
    dataIndex: "year",
    key: "year",
    width: "1%",
    align: "left",
  },
  {
    title: "Mes",
    dataIndex: "month",
    key: "month",
    width: "1%",
    align: "left",
  },
  {
    title: "Banco",
    dataIndex: "bank",
    key: "bank",
    width: "1%",
    align: "left",
  },
  {
    title: "Descripcion",
    dataIndex: "description",
    key: "description",
    width: "30%",
    align: "left",
  },
  {
    title: "Tarjeta",
    dataIndex: "type",
    key: "type",
    width: "5%",
  },
  {
    title: "Categoria",
    dataIndex: "category",
    key: "category",
    width: "5%",
    render: (_: unknown, record: Expense) => record.category ?? "-",
    align: "left",
  },
  {
    title: "Moneda",
    dataIndex: "currency",
    key: "currency",
    width: "5%",
    render: (_: unknown, record: Expense) => record.currency?.symbol ?? "-",
    align: "left",
  },

  {
    title: "Cuotas Totales",
    dataIndex: "cuotasTotales",
    key: "cuotasTotales",
    width: "20%",
    align: "right",
  },
  {
    title: "Cuota Actual",
    dataIndex: "cuotaActual",
    key: "cuotaActual",
    width: "10%",
    align: "right",
  },

  {
    title: "Dinero",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => `$${amount.toFixed(2)}`,
    width: "10%",
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    width: "1%",
    align: "right",
  },
];

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
      <Table<Expense>
        rowKey="id"
        dataSource={expenses}
        columns={columns}
        size="small"
        bordered
        pagination={{
          showSizeChanger: true,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: data.totalPages,
          showTotal: (total) =>
            `Total ${total} ${total === 1 ? "item" : "items"}`,
        }}
      />
    </div>
  );
}
