import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Button, Form, message, Row, Select, Spin, Upload } from "antd";
import { FileAddFilled, UploadOutlined } from "@ant-design/icons";
import { getExpenseApi, uploadExpenseApi } from "../../apis/ExpenseApi";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import ModalComponent from "../../components/modals/Modal";
import { BankEnum } from "../../enums/BankEnum";
import { usePagination } from "../../apis/hooks/usePagination";
import DragUpload from "../../components/DragUpload";

export const Route = createFileRoute("/expenses/history")({
  component: RouteComponent,
});

const EXPENSES_QUERY_KEY = ["expenses-history"] as const;
const DEFAULT_PAGE_SIZE = 25;

const createExpenseFactoryQuery = (
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

interface UploadForm {
  file: File | null;
  bank: string | null;
}

const initialUploadForm: UploadForm = {
  file: null,
  bank: null,
};

function RouteComponent() {
  const { page, nextPage, prevPage, resetPage, canGoPrev } = usePagination();
  const [filters, setFilters] = useState<{
    bank?: string[];
    paymentMethod?: string[];
    currency?: string[];
    date?: string;
  }>({});
  const queryConfig = useMemo(
    () => createExpenseFactoryQuery(page, DEFAULT_PAGE_SIZE, filters),
    [page, filters]
  );
  const { isLoading, data, isFetching } = useSuspenseQuery(queryConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>(initialUploadForm);

  const queryClient = useQueryClient();

  const expenses = isFetching ? [] : data?.content || [];
  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.bank) return;
    uploadMutation.mutate({ file: uploadForm.file, bank: uploadForm.bank });
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, bank }: { file: File; bank: string }) =>
      uploadExpenseApi(file, bank),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
      setModalOpen(false);
      setUploadForm(initialUploadForm);
    },
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
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

  const updateUploadForm = (updates: Partial<UploadForm>) => {
    setUploadForm((prev) => ({ ...prev, ...updates }));
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setUploadForm(initialUploadForm);
  };

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

      <Spin spinning={isLoading} size="large" tip="Cargando gastos...">
        {expenses.length === 0 ? (
          <DragUpload
            onFileUpload={(file, bank) => {
              if (!bank) {
                message.warning(
                  "Seleccione un banco antes de subir el archivo"
                );
                setModalOpen(true);
                return;
              }
              uploadMutation.mutate({ file, bank: bank });
            }}
          />
        ) : (
          <ExpenseTable
            expenses={expenses}
            page={page}
            nextPage={nextPage}
            prevPage={prevPage}
            canGoPrev={canGoPrev}
            totalElements={data?.totalElements || 0}
            pageSize={DEFAULT_PAGE_SIZE}
            onChangeFilters={handleFiltersChange}
          />
        )}
      </Spin>

      <ModalComponent
        open={modalOpen}
        onClose={handleCloseModal}
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
              onChange={(value: string) => updateUploadForm({ bank: value })}
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
                updateUploadForm({ file });
                return false;
              }}
              maxCount={1}
              onRemove={() => updateUploadForm({ file: null })}
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
}
