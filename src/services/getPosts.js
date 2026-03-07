import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const getPosts = () => {
  return axios.get(`${SERVER_URI}/getposts`);
};
