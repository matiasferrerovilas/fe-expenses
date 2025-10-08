import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteExpenseApi,
  getExpenseApi,
  updateExpenseApi,
} from "../../../apis/ExpenseApi";
import { useCallback, useMemo, useState } from "react";
import { usePagination } from "../../../apis/hooks/usePagination";
import { Col, Form, Popconfirm, Row, Spin, Table, Tag, theme } from "antd";
import {
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Expense } from "../../../models/Expense";
import { TypeEnum } from "../../../enums/TypeExpense";
import { CurrencyEnum } from "../../../enums/CurrencyEnum";
import { BankEnum } from "../../../enums/BankEnum";
import EditableMovementCell from "../EditableMovementCell";

const EXPENSES_QUERY_KEY = ["expenses-history"] as const;
const DEFAULT_PAGE_SIZE = 25;
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

const getMovementQuery = (
  page: number,
  size: number = DEFAULT_PAGE_SIZE,
  filters: {
    bank?: string[];
    paymentMethod?: string[];
    currencySymbol?: string[];
    date?: string;
  }
) =>
  queryOptions({
    queryKey: [...EXPENSES_QUERY_KEY, page, size, filters],
    queryFn: () => getExpenseApi({ page, size, ...filters }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

export default function MovementTable() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const { page, nextPage, prevPage, resetPage, canGoPrev } = usePagination();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<{
    bank?: string[];
    paymentMethod?: string[];
    currency?: string[];
    date?: string;
  }>({});
  const queryConfig = useMemo(
    () => getMovementQuery(page, DEFAULT_PAGE_SIZE, filters),
    [page, filters]
  );
  const { data, isFetching } = useQuery(queryConfig);
  const movements = data?.content ? data.content : [];
  const isEditing = (record: Expense) => record.id === editingKey;
  const edit = (record: Expense) => {
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

  const save = async (id: number) => {
    try {
      const values = await form.validateFields();

      const original = movements.find((e) => e.id === id);
      if (!original) {
        setEditingKey(null);
        return;
      }

      const updated: Expense = {
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
  const cancel = () => {
    setEditingKey(null);
  };
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => deleteExpenseApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSES_QUERY_KEY,
        exact: false,
      });
    },
    onError: (err) => {
      console.error("Error eliminando movimiento:", err);
    },
  });
  const updateExpenseMutation = useMutation({
    mutationFn: (expense: Expense) => updateExpenseApi(expense),
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
  const columns: ColumnsType<Expense> = useMemo(() => {
    const paymentMethodFilters = Array.from(
      new Set(movements.map((e) => e.type))
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
        render: (date: string) => new Date(date).toLocaleDateString(),
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
        render: (_: unknown, record: Expense) => (
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
        render: (_: unknown, record: Expense) => (
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
        render: (_: unknown, record: Expense) => (
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
        inputType: (record: Expense) =>
          record.type === TypeEnum.CREDITO.toString() ? "number" : undefined,
        width: "7%",
        align: "right",
        editable: (record: Expense) =>
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
        render: (_: unknown, record: Expense) => {
          return isEditing(record) ? (
            <Row gutter={[0, 0]} wrap={false}>
              <Col>
                <Tag
                  color="success"
                  onClick={() => save(record.id)}
                  style={{ cursor: "pointer" }}
                >
                  <SaveOutlined />
                </Tag>
              </Col>
              <Col>
                <Tag
                  color="error"
                  onClick={cancel}
                  style={{ cursor: "pointer" }}
                >
                  <CloseOutlined />
                </Tag>
              </Col>
            </Row>
          ) : (
            <Row gutter={[0, 0]} wrap={false}>
              <Col>
                <Tag
                  color="default"
                  onClick={() => edit(record)}
                  style={{ cursor: "pointer" }}
                >
                  <EditTwoTone />
                </Tag>
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
    ] as ColumnsType<Expense>;
  }, [movements, editingKey]);
  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: Expense) => {
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
          editable,
        };
      },
    };
  });
  const handleFiltersChange = useCallback(
    (newFilters: {
      bank?: string[];
      paymentMethod?: string[];
      currency?: string[];
      date?: string;
    }) => {
      setFilters(newFilters);
      resetPage();
    },
    [resetPage]
  );

  return (
    <div>
      {isFetching ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            width: "100%",
          }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 120 }} spin />}
            size="large"
          />
        </div>
      ) : (
        <Form form={form} component={false}>
          <Table<Expense>
            rowKey="id"
            dataSource={movements}
            components={{
              body: {
                cell: EditableMovementCell,
              },
            }}
            columns={mergedColumns as ColumnsType<Expense>}
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
              const currency = filters.currency as string[] | undefined;
              handleFiltersChange({ bank, paymentMethod, currency });
            }}
            pagination={{
              showSizeChanger: false,
              defaultPageSize: DEFAULT_PAGE_SIZE,
              total: data?.totalElements || 0,
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
        </Form>
      )}
    </div>
  );
}
