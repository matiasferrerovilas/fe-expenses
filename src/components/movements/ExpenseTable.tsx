import { useMemo, useState } from "react";
import { Col, Form, Popconfirm, Row, Table, Tag, theme, Tooltip } from "antd";
import type { Movement } from "../../models/Expense";
import type { ColumnsType } from "antd/es/table";
import { BankEnum } from "../../enums/BankEnum";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import {
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  SaveOutlined,
} from "@ant-design/icons";
import EditableMovementCell from "./EditableMovementCell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpenseApi, updateExpenseApi } from "../../apis/ExpenseApi";
import { TypeEnum } from "../../enums/TypeExpense";

interface Props {
  expenses: Movement[];
  page: number;
  goToPage: (p: number) => void;
  totalElements: number;
  pageSize: number;
  onChangeFilters: (filters: any) => void;
}
const EXPENSES_QUERY_KEY = ["expenses-history"] as const;

const COLUMN_INPUT_CONFIG: Record<
  string,
  "number" | "text" | "bank" | "currency" | "type" | "category"
> = {
  amount: "number",
  cuotaActual: "number",
  cuotasTotales: "number",
  year: "number",
  month: "number",
  bank: "bank",
  currency: "currency",
  category: "category",
  type: "type",
};

export default function ExpenseTable({
  expenses,
  page,
  goToPage,
  totalElements,
  pageSize,
  onChangeFilters,
}: Props) {
  const { token } = theme.useToken();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [form] = Form.useForm();

  const isEditing = (record: Movement) => record.id === editingKey;

  const edit = (record: Movement) => {
    form.setFieldsValue({
      date: record.date,
      year: record.year,
      month: record.month,
      bank: record.bank,
      description: record.description,
      type: record.type,
      category: record.category?.description ?? "",
      currency: record.currency?.symbol ?? "",
      cuotasTotales: record.cuotasTotales,
      cuotaActual: record.cuotaActual,
      amount: record.amount,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const queryClient = useQueryClient();

  const updateExpenseMutation = useMutation({
    mutationFn: (expense: Movement) => updateExpenseApi(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSES_QUERY_KEY,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("Error actualizando movimiento:", err);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => deleteExpenseApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSES_QUERY_KEY,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("Error actualizando movimiento:", err);
    },
  });

  const handleDelete = async (id: number) => {
    deleteExpenseMutation.mutate(id);
  };
  const save = async (id: number) => {
    try {
      const values = await form.validateFields();

      const original = expenses.find((e) => e.id === id);
      if (!original) {
        setEditingKey(null);
        return;
      }

      const updated: Movement = {
        ...original,
        amount: values.amount ?? original.amount,
        bank: values.bank ?? original.bank,
        description: values.description ?? original.description,
        date: values.date ?? original.date,
        year: values.year ?? original.year,
        month: values.month ?? original.month,
        type: values.type ?? original.type,
        cuotaActual: values.cuotaActual ?? original.cuotaActual,
        cuotasTotales: values.cuotasTotales ?? original.cuotasTotales,
        category:
          typeof values.category === "string"
            ? { description: values.category }
            : values.category ?? original.category,
        currency:
          typeof values.currency === "string"
            ? { symbol: values.currency }
            : values.currency ?? original.currency,
      };
      updateExpenseMutation.mutate(updated);
      setEditingKey(null);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const columns: ColumnsType<Movement> = useMemo(() => {
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
        width: "4%",
        align: "left",
        render: (date: string) => {
          const local = new Date(`${date}T00:00:00`);
          return local.toLocaleDateString();
        },
      },
      {
        title: "Banco",
        dataIndex: "bank",
        inputType: "bank",
        key: "bank",
        width: "4%",
        align: "left",
        editable: true,
        filters: bankFilters,
        render: (_: unknown, record: Expense) => (
          <Tag color="magenta">
            {record.bank
              ? record.bank.charAt(0).toUpperCase() +
                record.bank.slice(1).toLowerCase()
              : "-"}
          </Tag>
        ),
        onFilter: (value, record) => (record.bank ?? "-") === (value as string),
      },
      {
        title: "Descripcion",
        dataIndex: "description",
        inputType: "text",
        key: "description",
        width: "15%",
        align: "left",
        editable: true,
      },
      {
        title: "Tarjeta",
        dataIndex: "type",
        key: "type",
        width: "2%",
        filters: paymentMethodFilters,
        onFilter: (value, record) => (record.type ?? "-") === (value as string),
        render: (_: unknown, record: Movement) => (
          <Tag color="green">
            {record.type
              ? record.type.charAt(0).toUpperCase() +
                record.type.slice(1).toLowerCase()
              : "-"}
          </Tag>
        ),
      },
      {
        title: "Categoria",
        dataIndex: "category",
        key: "category",
        width: "5%",
        inputType: "category",
        editable: true,
        render: (_: unknown, record: Movement) => (
          <Tag color="success">
            {record.category?.description
              ? record.category.description.charAt(0).toUpperCase() +
                record.category.description.slice(1).toLowerCase()
              : "-"}
          </Tag>
        ),
        align: "center",
      },
      {
        title: "Moneda",
        dataIndex: "currency",
        key: "currency",
        width: "5%",
        inputType: "currency",
        editable: true,
        render: (_: unknown, record: Movement) => (
          <Tag color="blue">
            {record.currency?.symbol ? record.currency.symbol : "-"}
          </Tag>
        ),
        align: "center",
        filters: currencyFilters,
        onFilter: (value, record) =>
          (record.currency?.symbol ?? "-") === (value as string),
      },
      {
        title: "Cuotas Totales",
        dataIndex: "cuotasTotales",
        key: "cuotasTotales",
        inputType: (record: Movement) =>
          record.type === TypeEnum.CREDITO.toString() ? "number" : undefined,
        width: "7%",
        align: "right",
        editable: (record: Movement) =>
          record.type === TypeEnum.CREDITO.toString() ? true : false,
      },
      {
        title: "Cuota Actual",
        dataIndex: "cuotaActual",
        key: "cuotaActual",
        inputType: "number",
        width: "6%",
        align: "right",
        editable: true,
      },
      {
        title: "Dinero",
        dataIndex: "amount",
        key: "amount",
        inputType: "number",
        width: "10%",
        editable: true,
        render: (amount: number) => `$${amount.toFixed(2)}`,
      },
      { title: "Id", dataIndex: "id", key: "id", width: "1%", align: "right" },
      {
        title: "",
        width: "1%",
        align: "right",
        render: (_: unknown, record: Movement) => {
          return isEditing(record) ? (
            <Row gutter={[0, 0]} wrap={false}>
              <Col>
                <Tooltip placement="top" title="Guardar">
                  <Tag
                    color="success"
                    onClick={() => save(record.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <SaveOutlined />
                  </Tag>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip placement="top" title="Cancelar">
                  <Tag
                    color="error"
                    onClick={cancel}
                    style={{ cursor: "pointer" }}
                  >
                    <CloseOutlined />
                  </Tag>
                </Tooltip>
              </Col>
            </Row>
          ) : (
            <Row gutter={[0, 0]} wrap={false}>
              <Col>
                <Tooltip placement="top" title="Editar">
                  <Tag
                    color="default"
                    onClick={() => edit(record)}
                    style={{ cursor: "pointer" }}
                  >
                    <EditTwoTone />
                  </Tag>
                </Tooltip>
              </Col>
              <Col>
                <Popconfirm
                  title={`Eliminar Movimiento N° ${record.id}`}
                  description="Seguro quiere eliminar el movimiento?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Si"
                  cancelText="No"
                >
                  <Tag color="default" style={{ cursor: "pointer" }}>
                    <DeleteTwoTone />
                  </Tag>
                </Popconfirm>
              </Col>
            </Row>
          );
        },
      },
    ] as ColumnsType<Movement>;
  }, [expenses, editingKey]);

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: Movement) => {
        let editable = col.editable;
        let inputType =
          col.inputType || COLUMN_INPUT_CONFIG[col.dataIndex as string];

        if (
          col.dataIndex === "cuotasTotales" ||
          col.dataIndex === "cuotaActual"
        ) {
          editable = record.type === TypeEnum.CREDITO.toString();
          inputType = editable ? "number" : undefined;
        }

        return {
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });

  return (
    <Form form={form} component={false}>
      <Table<Movement>
        rowKey="id"
        dataSource={expenses}
        components={{
          body: {
            cell: EditableMovementCell,
          },
        }}
        columns={mergedColumns as ColumnsType<Movement>}
        size="small"
        bordered
        rowClassName={(record) =>
          record.cuotaActual &&
          record.cuotasTotales &&
          record.cuotaActual === record.cuotasTotales
            ? "ant-table-row-completed"
            : ""
        }
        onChange={(_, filters) => {
          const bank = filters.bank as string[] | undefined;
          const paymentMethod = filters.type as string[] | undefined;
          const currencySymbol = filters.currency as string[] | undefined;
          onChangeFilters({ bank, paymentMethod, currencySymbol });
        }}
        pagination={{
          showSizeChanger: false,
          pageSize: pageSize,
          total: totalElements,
          current: page + 1,
          onChange: (p) => goToPage(p - 1),
        }}
        style={{
          ["--completed-row-bg" as any]: token.colorInfoBg,
        }}
      />
    </Form>
  );
}
