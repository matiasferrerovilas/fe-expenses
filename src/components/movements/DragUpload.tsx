import { InboxOutlined } from "@ant-design/icons";
import { Col, Row, Select, type UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import { BankEnum } from "../../enums/BankEnum";
import { useMessage } from "../../apis/hooks/useMessage";

interface DragUploadProps {
  onFileUpload: (file: File, bank: string) => void;
}

export default function DragUpload({ onFileUpload }: DragUploadProps) {
  const [bank, setBank] = useState<string>("");
  const { showMessage, contextHolder } = useMessage();

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf",
    beforeUpload(file) {
      onFileUpload(file, bank);
      return false;
    },
    onChange(info) {
      if (info.file.status === "removed") {
        showMessage("info", "Archivo soltado");
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      showMessage("info", "Archivo soltado");
    },
  };

  return (
    <>
      {contextHolder}
      <Row
        gutter={[0, 8]}
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <Select
              placeholder="Seleccionar banco"
              onChange={(value: string) => {
                setBank(value);
              }}
              style={{ width: "100%" }}
            >
              {Object.values(BankEnum).map((bank) => (
                <Select.Option key={bank} value={bank}>
                  {bank}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Dragger
            {...props}
            disabled={!bank}
            style={{
              backgroundColor: !bank ? "#f5f5f5" : "white",
              borderRadius: "8px",
              cursor: !bank ? "not-allowed" : "pointer",
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: !bank ? "#d9d9d9" : undefined }} />
            </p>
            <p className="ant-upload-text">
              {!bank
                ? "Primero selecciona un banco para continuar" // ✅ Mensaje dinámico
                : "Haz clic o arrastra el archivo a esta área para cargarlo"}
            </p>
            <p className="ant-upload-hint" style={{ marginTop: 8 }}>
              Formatos permitidos:PDF
            </p>
          </Dragger>
        </Col>
      </Row>
    </>
  );
}
