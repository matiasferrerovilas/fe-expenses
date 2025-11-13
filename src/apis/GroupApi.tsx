import { api } from "./axios";

export async function exitGroupApi(id: number) {
  return api
    .delete("/groups/invitations/" + id)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error exiting group:", error);
      throw error;
    });
}
