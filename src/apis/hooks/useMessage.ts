import { message } from "antd";

type MessageType = "success" | "error" | "info";

export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (type: MessageType, content: string) => {
    setTimeout(() => {
      messageApi[type](content);
    }, 0);
  };
  return { showMessage, contextHolder };
};
