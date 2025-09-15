import { Table, theme } from "antd";
import type { Expense } from "../../models/Expense";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

interface Props {
  expenses: Expense[];
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  canGoPrev: boolean;
  totalElements: number;
  pageSize: number;
}

export default function ExpenseTable({
  expenses,
  page,
  nextPage,
  prevPage,
  canGoPrev,
  totalElements,
  pageSize,
}: Props) {
  const { token } = theme.useToken();

  const columns: ColumnsType<Expense> = useMemo(() => {
    const typeFilters = Array.from(new Set(expenses.map((e) => e.type))).map(
      (type) => ({
        text: type ?? "-",
        value: type ?? "-",
      })
    );
    const currencyFilters = Array.from(
      new Set(expenses.map((e) => e.currency?.symbol))
    ).map((type) => ({
      text: type ?? "-",
      value: type ?? "-",
    }));

    return [
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
        filters: typeFilters,
        onFilter: (value, record) => (record.type ?? "-") === (value as string),
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
        filters: currencyFilters,
        onFilter: (value, record) => (record.type ?? "-") === (value as string),
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
    ] as ColumnsType<Expense>;
  }, [expenses]);

  return (
    <Table<Expense>
      rowKey="id"
      dataSource={expenses}
      columns={columns}
      size="small"
      bordered
      rowClassName={(record) =>
        record.cuotaActual &&
        record.cuotasTotales &&
        record.cuotaActual === record.cuotasTotales
          ? "ant-table-row-completed"
          : ""
      }
      pagination={{
        showSizeChanger: false,
        defaultPageSize: pageSize,
        total: totalElements,
        onChange: (p) => {
          if (p - 1 > page) nextPage();
          else if (p - 1 < page && canGoPrev) prevPage();
        },
      }}
      style={{
        ["--completed-row-bg" as any]: token.colorInfoBg,
      }}
    />
  );
}
