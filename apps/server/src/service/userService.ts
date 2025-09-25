import axios from "axios";

const DATA_SERVICE_URL =
  process.env.DATA_SERVICE_URL || "http://localhost:4001";

export const userService = {
  async createOrUpdateUser(userId: string, data: any) {
    await axios.put(`${DATA_SERVICE_URL}/users/${userId}`, data);
  },

  async getUserById(userId: string) {
    const { data } = await axios.get(`${DATA_SERVICE_URL}/users/${userId}`);
    return data.user ?? null;
  },
};
