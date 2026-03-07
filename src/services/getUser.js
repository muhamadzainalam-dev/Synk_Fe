import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const GetUser = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/getuser`, {
      withCredentials: true,
    });

    const user = response.data.user;
    return user;
  } catch (error) {
    return error.response.statusText;
  }
};
