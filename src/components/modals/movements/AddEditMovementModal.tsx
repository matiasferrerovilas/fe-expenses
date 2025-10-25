import { Button, Form } from "antd";
import ModalComponent from "../Modal";

interface AddEditMovementModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
}
export default function AddEditMovementModal({
  modalOpen,
  handleCloseModal,
}: AddEditMovementModalProps) {
  return (
    <ModalComponent
      open={modalOpen}
      onClose={handleCloseModal}
      title="Agregar Movimiento"
      footer={<Button type="primary">Agregar</Button>}
    >
      <Form layout="vertical">
        <Form.Item
          name="bank"
          label="Banco"
          rules={[{ required: true, message: "Seleccione un banco" }]}
        ></Form.Item>
      </Form>
    </ModalComponent>
  );
}
