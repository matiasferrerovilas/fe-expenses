import { Modal } from "antd";
import type { ReactNode } from "react";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export default function ModalComponent({
  open,
  onClose,
  title,
  children,
  footer,
  width = 600,
}: AppModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={footer}
      width={width}
      destroyOnHidden
      centered
    >
      {children}
    </Modal>
  );
}
