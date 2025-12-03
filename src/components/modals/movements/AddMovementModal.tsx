import { Button, Tabs } from "antd";
import ModalComponent from "../Modal";
import { useRef, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import ImportMovementTab from "./ImportMovementTab";
import AddMovementExpenseTab from "./AddMovementExpenseTab";

export default function AddMovementModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState<string>("1");

  const uploadRef = useRef<{ handleConfirm: () => void } | null>(null);
  const expenseRef = useRef<{ handleConfirm: () => void } | null>(null);

  const handleConfirm = () => {
    switch (activeTab) {
      case "1":
        uploadRef.current?.handleConfirm();
        break;
      case "2":
        expenseRef.current?.handleConfirm();
        break;
    }
  };
  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => setModalOpen(true)}
      >
        <PlusCircleOutlined />
        Movimiento
      </Button>
      <ModalComponent
        open={modalOpen}
        onClose={handleCloseModal}
        title="Agregar Movimiento"
        footer={
          <Button type="primary" onClick={handleConfirm}>
            Agregar
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Archivo" key="1">
            <ImportMovementTab ref={uploadRef} onSuccess={handleCloseModal} />
          </TabPane>
          <TabPane tab="Individual" key="2">
            <AddMovementExpenseTab
              ref={expenseRef}
              onSuccess={handleCloseModal}
            />
          </TabPane>
        </Tabs>
      </ModalComponent>
    </>
  );
}
