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
  DownCircleOutlined,
  EditTwoTone,
  LoadingOutlined,
  SaveOutlined,
  UpCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Expense } from "../../../models/Expense";
import { TypeEnum } from "../../../enums/TypeExpense";
import type { MovementFilters } from "../../../routes/movement";

const EXPENSES_QUERY_KEY = ["expenses-history"] as const;
const DEFAULT_PAGE_SIZE = 25;

interface MovementTableProps {
  filters: MovementFilters;
}
export default function MovementTable({ filters }: MovementTableProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const { page, nextPage, prevPage, resetPage, canGoPrev } = usePagination();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: [...EXPENSES_QUERY_KEY, page, filters],
    queryFn: () => getExpenseApi({ page, size: DEFAULT_PAGE_SIZE, filters }),
    staleTime: 5 * 60 * 1000,
    select: (data) => data?.content ?? [],
  });
  const movements = data ? data : [];
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
        title: "Tarjeta",
        dataIndex: "type",
        key: "type",
        width: "2%",
        render: (_: unknown, record: Expense) => {
          let color = "default";
          let IconComponent = UpCircleOutlined;

          switch (record.type) {
            case TypeEnum.CREDITO.toString():
              color = "gray";
              IconComponent = WalletOutlined;
              break;
            case TypeEnum.DEBITO.toString():
              color = "red";
              IconComponent = DownCircleOutlined;
              break;
            case "INGRESO":
              color = "green";
              IconComponent = UpCircleOutlined;
              break;
            default:
              color = "gray";
              IconComponent = UpCircleOutlined;
          }

          return (
            <Tag color={color}>
              <IconComponent />{" "}
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
        inputType: "category",
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
        render: (_: unknown, record: Expense) => (
          <Tag color="blue">
            {record.currency?.symbol ? record.currency.symbol : "-"}
          </Tag>
        ),
        align: "center",
      },
      {
        title: "Descripcion",
        dataIndex: "description",
        inputType: "text",
        key: "description",
        width: "15%",
        align: "left",
      },
      {
        title: "Cuotas",
        dataIndex: "cuotasTotales",
        key: "cuotasTotales",
        inputType: (record: Expense) =>
          record.type === TypeEnum.CREDITO.toString() ? "number" : undefined,
        width: "7%",
        align: "right",
        render: (_: unknown, record: Expense) => {
          const { cuotaActual, cuotasTotales } = record;

          const mostrarCuota =
            cuotasTotales != null &&
            !(cuotaActual === 0 && cuotasTotales === 0);

          return mostrarCuota ? (
            <span>
              {cuotaActual} / {cuotasTotales}
            </span>
          ) : (
            "-"
          );
        },
      },
      {
        title: "Dinero",
        dataIndex: "amount",
        key: "amount",
        inputType: "number",
        width: "10%",
        render: (amount: number, record: any) => {
          const isIngreso = record.type === TypeEnum.INGRESO;
          const color = isIngreso ? "green" : "red";
          const sign = isIngreso ? "+" : "-";

          const formattedAmount = new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);

          return (
            <span style={{ color, fontWeight: 500 }}>
              {sign}${formattedAmount}
            </span>
          );
        },
      },
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
  }, [editingKey]);
  const handleFiltersChange = useCallback(
    (newFilters: {
      bank?: string[];
      type?: string[];
      currency?: string[];
      date?: string;
    }) => {
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
            size="small"
            bordered
            rowClassName={(record) =>
              record.cuotaActual &&
              record.cuotasTotales &&
              record.cuotaActual === record.cuotasTotales
                ? "ant-table-row-completed"
                : ""
            }
            columns={columns}
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
