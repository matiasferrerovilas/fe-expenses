import { createFileRoute } from "@tanstack/react-router";
import ResumenGasto from "../../components/balance/ResumenGasto";
import { Button, Form, Row, Select, Upload } from "antd";
import { FileAddFilled, UploadOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getExpenseApi, uploadExpenseApi } from "../../apis/ExpenseApi";
import ModalComponent from "../../components/modals/Modal";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import dayjs from "dayjs";
import { BankEnum } from "../../enums/BankEnum";
import ExpenseLiveTable from "../../components/expenses/ExpenseLiveTable";
import { usePagination } from "../../apis/hooks/usePagination";

export const Route = createFileRoute("/expenses/live")({
  component: RouteComponent,
});

const EXPENSES_QUERY_KEY = ["expenses-live"] as const;
const DEFAULT_PAGE_SIZE = 25;

const createExpenseFactoryQuery = (
  page: number,
  size: number = DEFAULT_PAGE_SIZE
) =>
  queryOptions({
    queryKey: [...EXPENSES_QUERY_KEY, page, size],
    queryFn: () =>
      getExpenseApi({
        page,
        size,
        date: dayjs().format("YYYY-MM-DD"),
      }),
    staleTime: 5 * 60 * 1000,
  });

function RouteComponent() {
  const { page, nextPage, prevPage, resetPage, canGoPrev } = usePagination();
  const [filters, setFilters] = useState<{
    bank?: string[];
    paymentMethod?: string[];
    currency?: string[];
    date?: string;
  }>({});
  const queryConfig = useMemo(
    () => createExpenseFactoryQuery(page, DEFAULT_PAGE_SIZE),
    [page]
  );
  const { data } = useSuspenseQuery(queryConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [bank, setBank] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const expenses = data?.content ?? [];

  const handleUpload = () => {
    if (!file || !bank) return;
    uploadMutation.mutate({ file, bank });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, bank }: { file: File; bank: string }) =>
      uploadExpenseApi(file, bank),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setModalOpen(false);
      setFile(null);
      setBank(null);
    },
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...EXPENSES_QUERY_KEY, page, DEFAULT_PAGE_SIZE],
      });
    },
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
      <ResumenGasto />
      <Row align={"middle"}>
        <h1>Gastos</h1>
        <Button
          type="primary"
          icon=<FileAddFilled />
          style={{ marginLeft: "auto" }}
          onClick={() => setModalOpen(true)}
        >
          Cargar Gasto
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
      <ModalComponent
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Gasto"
        footer={
          <Button type="primary" onClick={handleUpload}>
            Subir
          </Button>
        }
      >
        <Form layout="vertical">
          <Form.Item
            name="bank"
            label="Banco"
            rules={[{ required: true, message: "Seleccione un banco" }]}
          >
            <Select
              placeholder="Seleccionar banco"
              onChange={(value: string) => setBank(value)}
            >
              {Object.values(BankEnum).map((bank) => (
                <Select.Option key={bank} value={bank}>
                  {bank}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
}
