import { chatEndpoints } from "../../services/apis";
import axios from "axios";

export async function getAllMessages() {
  try {
    const response = await axios.get(chatEndpoints.GET_All_MESSAGES_API);
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
