import { createFileRoute } from "@tanstack/react-router";
import ResumenGasto from "../../components/balance/ResumenGasto";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getExpenseApi,
  uploadExpense,
  uploadExpenseApi,
} from "../../apis/ExpenseApi";
import ModalComponent from "../../components/modals/Modal";
import dayjs, { Dayjs } from "dayjs";
import { BankEnum } from "../../enums/BankEnum";
import ExpenseLiveTable from "../../components/expenses/ExpenseLiveTable";
import { usePagination } from "../../apis/hooks/usePagination";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { TypeEnum } from "../../enums/TypeExpense";
import ExpenseIndividualAdd from "../../components/expenses/ExpenseIndividualAdd";

export const Route = createFileRoute("/expenses/live")({
  component: RouteComponent,
});

const EXPENSES_QUERY_KEY = ["expenses-live"] as const;
const DEFAULT_PAGE_SIZE = 25;

export interface CreateExpenseForm {
  bank: string;
  description: string;
  date: Dayjs;
  currency: string;
  amount: number;
  type: string;
  cuotaActual?: number;
  cuotasTotales?: number;
  category?: string;
}
interface ExpenseFilters {
  bank?: string[];
  paymentMethod?: string[];
  currency?: string[];
  date?: string;
}

const createExpenseFactoryQuery = (
  page: number,
  size: number = DEFAULT_PAGE_SIZE,
  filters: ExpenseFilters = {}
) =>
  queryOptions({
    queryKey: [...EXPENSES_QUERY_KEY, page, size],
    queryFn: () =>
      getExpenseApi({
        page,
        size,
        date: filters.date || dayjs().format("YYYY-MM-DD"),
        bank: filters.bank,
        paymentMethod: filters.paymentMethod,
        currencySymbol: filters.currency,
      }),
    staleTime: 5 * 60 * 1000,
  });

function RouteComponent() {
  const { page, nextPage, prevPage, resetPage, canGoPrev } = usePagination();
  const [form] = Form.useForm<CreateExpenseForm>();
  const [modalOpen, setModalOpen] = useState(false);

  const [filters, setFilters] = useState<ExpenseFilters>({});

  const queryConfig = useMemo(
    () => createExpenseFactoryQuery(page, DEFAULT_PAGE_SIZE, filters),
    [page, filters]
  );
  const { data } = useSuspenseQuery(queryConfig);
  const queryClient = useQueryClient();

  const expenses = data?.content ?? [];

  const handleFinish = (values: CreateExpenseForm) => {
    uploadMutation.mutate(values);
    form.resetFields();
  };

  const uploadMutation = useMutation({
    mutationFn: (expenseData: CreateExpenseForm) => {
      return uploadExpense(expenseData);
    },
    onSuccess: () => {
      message.success("Gasto creado exitosamente");
      setModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
      message.error("Error al crear el gasto");
    },
  });
  const handleFiltersChange = useCallback(
    (newFilters: ExpenseFilters) => {
      setFilters(newFilters);
      resetPage();
    },
    [resetPage]
  );

  return (
    <div>
      <ResumenGasto />

      {expenses.length === 0 ? (
        <>
          <h1>Gastos</h1>
          <ExpenseIndividualAdd onSubmit={handleFinish} />
        </>
      ) : (
        <>
          <Row align={"middle"}>
            <h1>Gastos</h1>
            <Button
              type="primary"
              icon=<FileAddFilled />
              style={{ marginLeft: "auto" }}
              onClick={() => setModalOpen(true)}
            >
              Gasto
            </Button>
          </Row>
          <ExpenseLiveTable
            expenses={expenses}
            page={page}
            nextPage={nextPage}
            prevPage={prevPage}
            canGoPrev={canGoPrev}
            totalElements={data?.totalElements || 0}
            pageSize={DEFAULT_PAGE_SIZE}
            onChangeFilters={handleFiltersChange}
          />
        </>
      )}
      <ModalComponent
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Gasto"
        footer={
          <Button type="primary" onClick={() => form.submit()}>
            Subir
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bank"
                label="Banco"
                rules={[{ required: true, message: "Seleccione un banco" }]}
              >
                <Select placeholder="Seleccionar banco">
                  {Object.values(BankEnum).map((bank) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Tipo"
                rules={[
                  { required: true, message: "Seleccione un tipo de Gasto" },
                ]}
              >
                <Select placeholder="Seleccionar banco">
                  {Object.values(TypeEnum).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {Form.useWatch("type", form) === TypeEnum.CREDITO && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Cuota Actual"
                  name="cuotaActual"
                  rules={[
                    { required: true, message: "Ingresar cuota actual" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const total = getFieldValue("cuotasTotales");
                        if (!value || !total || value <= total) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "La cuota actual no puede ser mayor que el total"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>{" "}
              <Col span={12}>
                <Form.Item
                  label="Cuotas Totales"
                  name="cuotasTotales"
                  rules={[
                    { required: true, message: "Ingresar cantidad de cuotas" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>{" "}
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Descripcion" name="description">
                <Input />
              </Form.Item>{" "}
            </Col>
            <Col span={12}>
              <Form.Item label="Categoria" name="category">
                <Input />
              </Form.Item>{" "}
            </Col>
          </Row>

          <Form.Item
            label="Fecha"
            name="date"
            rules={[{ required: true, message: "Seleccione una fecha" }]}
          >
            <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Moneda"
                rules={[{ required: true, message: "Seleccione una moneda" }]}
              >
                <Select placeholder="Seleccionar moneda">
                  {Object.values(CurrencyEnum).map((currency) => (
                    <Select.Option key={currency} value={currency}>
                      {currency}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Monto"
                name="amount"
                rules={[{ required: true, message: "Ingresar Monto" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
    </div>
  );
}
