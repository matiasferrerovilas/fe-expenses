import { Table, Tag, theme } from "antd";
import type { Expense } from "../../models/Expense";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { BankEnum } from "../../enums/BankEnum";
import { CurrencyEnum } from "../../enums/CurrencyEnum";

interface Props {
  expenses: Expense[];
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  canGoPrev: boolean;
  totalElements: number;
  pageSize: number;
  onChangeFilters: (filters: any) => void;
}

export default function ExpenseLiveTable({
  expenses,
  page,
  nextPage,
  prevPage,
  canGoPrev,
  totalElements,
  pageSize,
  onChangeFilters,
}: Props) {
  const { token } = theme.useToken();

  const columns: ColumnsType<Expense> = useMemo(() => {
    const paymentMethodFilters = Array.from(
      new Set(expenses.map((e) => e.type))
    ).map((type) => ({
      text: type ?? "-",
      value: type ?? "-",
    }));
    const bankFilters = Object.values(BankEnum).map((bank) => ({
      text: bank,
      value: bank,
    }));
    const currencyFilters = Object.values(CurrencyEnum).map(
      (currencySymbol) => ({
        text: currencySymbol,
        value: currencySymbol,
      })
    );

    return [
      {
        title: "Fecha",
        dataIndex: "date",
        key: "date",
        width: "1%",
        align: "left",
        render: (date: string) => {
          const local = new Date(`${date}T00:00:00`);
          return local.toLocaleDateString();
        },
      },
      {
        title: "Banco",
        dataIndex: "bank",
        key: "bank",
        width: "1%",
        align: "left",
        filters: bankFilters,
        render: (_: unknown, record: Expense) => {
          return (
            <Tag color="magenta">
              {record.bank
                ? record.bank.charAt(0).toUpperCase() +
                  record.bank.slice(1).toLowerCase()
                : "-"}
            </Tag>
          );
        },
        onFilter: (value, record) => (record.bank ?? "-") === (value as string),
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
        filters: paymentMethodFilters,
        onFilter: (value, record) => (record.type ?? "-") === (value as string),
        render: (_: unknown, record: Expense) => {
          return (
            <Tag color="green">
              {record.type
                ? record.type.charAt(0).toUpperCase() +
                  record.type.slice(1).toLowerCase()
                : "-"}
            </Tag>
          );
        },
      },
      {
        title: "Categoria",
        dataIndex: "category",
        key: "category",
        width: "5%",
        render: (_: unknown, record: Expense) => {
          return (
            <Tag color="success">
              {record.category?.description
                ? record.category.description.charAt(0).toUpperCase() +
                  record.category.description.slice(1).toLowerCase()
                : "-"}
            </Tag>
          );
        },

        align: "center",
      },
      {
        title: "Moneda",
        dataIndex: "currency",
        key: "currency",
        width: "5%",
        render: (_: unknown, record: Expense) => {
          return (
            <Tag color="blue">
              {record.currency?.symbol ? record.currency.symbol : "-"}
            </Tag>
          );
        },
        align: "center",
        filters: currencyFilters,
        onFilter: (value, record) =>
          (record.currency?.symbol ?? "-") === (value as string),
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
      onChange={(pagination, filters) => {
        const bank = filters.bank as string[] | undefined;
        const paymentMethod = filters.type as string[] | undefined;
        const currencySymbol = filters.currency as string[] | undefined;
        onChangeFilters({ bank, paymentMethod, currencySymbol });
      }}
      pagination={{
        showSizeChanger: false,
        defaultPageSize: pageSize,
        total: totalElements,
        current: page + 1,
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
