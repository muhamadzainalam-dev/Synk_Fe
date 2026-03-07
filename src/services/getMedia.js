import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const getMedia = (filename) => {
  return axios.post(
    `${SERVER_URI}/getreadingurl`,
    { filename },
    { withCredentials: true },
  );
};
