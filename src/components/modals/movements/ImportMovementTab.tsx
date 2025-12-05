import { forwardRef, useImperativeHandle } from "react";
import { Button, Form, Select, Typography, Upload } from "antd";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import { useGroups } from "../../../apis/hooks/useGroups";
import { useMutation } from "@tanstack/react-query";
import { BankEnum } from "../../../enums/BankEnum";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import { uploadExpenseApi } from "../../../apis/movement/ExpenseApi";
const { Text } = Typography;

export interface UploadForm {
  fileList: UploadFile<File>[] | null;
  bank: string | null;
  group: string | null;
}

export interface UploadPayload {
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
      mutationFn: (form: UploadPayload) => uploadExpenseApi(form),
      onSuccess: () => {
        console.debug("✅ Archivo subido correctamente");
        onSuccess?.();
      },
      onError: (err) => {
        console.error("❌ Error subiendo archivo:", err);
      },
    });

    useImperativeHandle(ref, () => ({
      handleConfirm: () => {
        const values = form.getFieldsValue();

        const file = values.fileList?.[0]?.originFileObj ?? null;

        const payload: UploadForm = {
          fileList: values.fileList,
          bank: values.bank,
          group: values.group,
        };

        uploadMutation.mutate({
          ...payload,
          file,
        });
      },
    }));

    const normFile = (e: UploadChangeParam<UploadFile<File>>) => {
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
        <div style={{ marginBottom: 10 }}>
          <Text type="secondary">
            🔹 Podés importar tu resumen bancario en formato{" "}
            <strong>PDF</strong>.
            <br />
            🔹 Bancos soportados actualmente: BBVA, Galicia.
            <br />
            🔹 Solo se admiten <strong>
              resúmenes de tarjeta de crédito
            </strong>{" "}
            por el momento.
          </Text>
        </div>
        <Form.Item
          name="bank"
          label="Banco"
          rules={[{ required: true, message: "Seleccione un banco" }]}
        >
          <Select placeholder="Seleccionar banco">
            {Object.values(BankEnum)
              .filter(
                (bank) => bank == BankEnum.GALICIA || bank == BankEnum.BBVA
              )
              .map((bank) => (
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
          name="fileList"
          label="Archivo"
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
