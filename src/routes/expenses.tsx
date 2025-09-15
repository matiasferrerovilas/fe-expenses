import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { getExpenseApi, uploadExpenseApi } from "../apis/ExpenseApi";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import ExpenseTable from "../components/expenses/ExpenseTable";
import { Button, Form, Row, Select, Upload } from "antd";
import { FileAddFilled, UploadOutlined } from "@ant-design/icons";
import ModalComponent from "../components/modals/Modal";

export const Route = createFileRoute("/expenses")({
  component: RouteComponent,
});

const EXPENSES_QUERY_KEY = ["expenses"] as const;
const DEFAULT_PAGE_SIZE = 25;

export const BankEnum = {
  BBVA: "BBVA",
  GALICIA: "GALICIA",
  HSBC: "HSBC",
} as const;

export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];

const createExpenseFactoryQuery = (
  page: number,
  size: number = DEFAULT_PAGE_SIZE
) =>
  queryOptions({
    queryKey: [...EXPENSES_QUERY_KEY, page, size],
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

  return (
    <div>
      <div>
        <Row align={"middle"}>
          <h1>Gastos</h1>
          <Button
            type="primary"
            icon=<FileAddFilled />
            style={{ marginLeft: "auto" }}
            onClick={() => setModalOpen(true)}
          >
            Cargar Gastos
          </Button>
        </Row>
      </div>

      <ExpenseTable
        expenses={expenses}
        page={page}
        nextPage={nextPage}
        prevPage={prevPage}
        canGoPrev={canGoPrev}
        totalElements={data.totalElements}
        pageSize={DEFAULT_PAGE_SIZE}
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
