import { Button, Form, Select, Upload } from "antd";
import ModalComponent from "../Modal";
import { BankEnum } from "../../../enums/BankEnum";
import { useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { uploadExpenseApi } from "../../../apis/ExpenseApi";
import { getAllUserGroups } from "../../../apis/UserApi";

interface AddEditMovementModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
}
interface UploadForm {
  file: File | null;
  bank: string | null;
  group: string | null;
}
const initialUploadForm: UploadForm = {
  file: null,
  bank: null,
  group: null,
};
const USER_GROUPS_QUERY_KEY = "user-groups" as const;

export default function AddEditMovementModal({
  modalOpen,
  handleCloseModal,
}: AddEditMovementModalProps) {
  const [uploadForm, setUploadForm] = useState<UploadForm>(initialUploadForm);
  const { data: userGroups = [] } = useSuspenseQuery({
    queryKey: [USER_GROUPS_QUERY_KEY],
    queryFn: () => getAllUserGroups(),
    staleTime: 5 * 60 * 1000,
  });
  const updateUploadForm = (updates: Partial<UploadForm>) => {
    setUploadForm((prev) => ({ ...prev, ...updates }));
  };
  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      bank,
      group,
    }: {
      file: File;
      bank: string;
      group: string;
    }) => uploadExpenseApi(file, bank, group),
    onSuccess: () => {
      handleCloseModal();
      setUploadForm(initialUploadForm);
    },
    onError: (err) => {
      console.error("Error subiendo archivo:", err);
    },
  });
  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.bank || !uploadForm.group) return;
    uploadMutation.mutate({
      file: uploadForm.file,
      bank: uploadForm.bank,
      group: uploadForm.group,
    });
  };
  return (
    <ModalComponent
      open={modalOpen}
      onClose={handleCloseModal}
      title="Agregar Movimiento"
      footer={
        <Button type="primary" onClick={handleUpload}>
          Agregar
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
        <Form.Item
          name="group"
          label="Grupo"
          rules={[{ required: true, message: "Seleccione un Grupo" }]}
        >
          <Select
            placeholder="Seleccionar group"
            onChange={(value: string) => updateUploadForm({ group: value })}
          >
            {userGroups.map((group) => (
              <Select.Option key={group.id} value={group.description}>
                {group.description}
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
  );
}
