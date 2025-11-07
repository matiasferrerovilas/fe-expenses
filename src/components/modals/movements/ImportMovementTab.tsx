import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Form, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useGroups } from "../../../apis/hooks/useGroups";
import { useMutation } from "@tanstack/react-query";
import { uploadExpenseApi } from "../../../apis/ExpenseApi";
import { BankEnum } from "../../../enums/BankEnum";

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
interface ImportMovementTabProps {
  onSuccess?: () => void;
}

const ImportMovementTab = forwardRef<unknown, ImportMovementTabProps>(
  ({ onSuccess }, ref) => {
    const { data: userGroups = [] } = useGroups();
    const [uploadForm, setUploadForm] = useState<UploadForm>(initialUploadForm);

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
        console.log("✅ Archivo subido correctamente");
        setUploadForm(initialUploadForm);
        onSuccess?.();
      },
      onError: (err) => {
        console.error("❌ Error subiendo archivo:", err);
      },
    });

    useImperativeHandle(ref, () => ({
      handleConfirm: () => {
        if (!uploadForm.file || !uploadForm.bank || !uploadForm.group) {
          console.warn("⚠️ Complete todos los campos antes de subir.");
          return;
        }
        uploadMutation.mutate({
          file: uploadForm.file,
          bank: uploadForm.bank,
          group: uploadForm.group,
        });
      },
    }));

    return (
      <Form
        layout="vertical"
        initialValues={userGroups && { group: userGroups[0]?.description }}
      >
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
          rules={[{ required: true, message: "Seleccione un grupo" }]}
        >
          <Select
            placeholder="Seleccionar grupo"
            onChange={(value: string) => updateUploadForm({ group: value })}
          >
            {userGroups.map((group) => (
              <Select.Option key={group.id} value={group.description}>
                {group.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Archivo">
          <Upload
            beforeUpload={(file) => {
              updateUploadForm({ file });
              return false; // evita carga automática
            }}
            maxCount={1}
            onRemove={() => updateUploadForm({ file: null })}
          >
            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
          </Upload>
        </Form.Item>
      </Form>
    );
  }
);

export default ImportMovementTab;
