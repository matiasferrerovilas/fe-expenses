import { InboxOutlined } from "@ant-design/icons";
import { Col, message, Row, Select, type UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import { BankEnum } from "../../enums/BankEnum";

interface DragUploadProps {
  onFileUpload: (file: File, bank: string) => void;
}

export default function DragUpload({ onFileUpload }: DragUploadProps) {
  const [bank, setBank] = useState<string>("");

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload(file) {
      onFileUpload(file, bank);
      return false;
    },
    onChange(info) {
      if (info.file.status === "removed") {
        message.info("Archivo eliminado");
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Row
      gutter={[0, 8]}
      style={{ height: "80vh", width: "80%", justifySelf: "center" }}
    >
      <Col span={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div style={{ marginBottom: 8 }}>
          <Select
            placeholder="Seleccionar banco"
            onChange={(value: string) => setBank(value)}
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
            backgroundColor: "white",
            border: "3px dashed #1890ff",
            borderRadius: "8px",
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Haga clic o arrastre el archivo a esta área para cargarlo
          </p>
        </Dragger>
      </Col>
    </Row>
  );
}
