import { forwardRef, useImperativeHandle } from "react";
import { Button, Form, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useGroups } from "../../../apis/hooks/useGroups";
import { useMutation } from "@tanstack/react-query";
import { uploadExpenseApi } from "../../../apis/ExpenseApi";
import { BankEnum } from "../../../enums/BankEnum";

export interface UploadForm {
  file: File | null;
  bank: string | null;
  group: string | null;
}

interface ImportMovementTabProps {
  onSuccess?: () => void;
}

const ImportMovementTab = forwardRef<unknown, ImportMovementTabProps>(
  ({ onSuccess }, ref) => {
    const { data: userGroups = [] } = useGroups();
    const [form] = Form.useForm<UploadForm>();

    const uploadMutation = useMutation({
      mutationFn: (form: UploadForm) => uploadExpenseApi(form),
      onSuccess: () => {
        console.log("✅ Archivo subido correctamente");
        onSuccess?.();
      },
      onError: (err) => {
        console.error("❌ Error subiendo archivo:", err);
      },
    });

    useImperativeHandle(ref, () => ({
      handleConfirm: () => {
        const values = form.getFieldsValue();

        const uploadForm: UploadForm = {
          file: values.file?.[0]?.originFileObj || null,
          bank: values.bank,
          group: values.group,
        };

        console.log("📦 Datos a enviar:", uploadForm);
        uploadMutation.mutate(uploadForm);
      },
    }));

    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={userGroups && { group: userGroups[0]?.description }}
      >
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

        <Form.Item
          name="group"
          label="Grupo"
          rules={[{ required: true, message: "Seleccione un grupo" }]}
        >
          <Select placeholder="Seleccionar grupo">
            {userGroups.map((group) => (
              <Select.Option key={group.id} value={group.description}>
                {group.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Archivo"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Seleccione un archivo" }]}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
          </Upload>
        </Form.Item>
      </Form>
    );
  }
);

export default ImportMovementTab;
