import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
  try {
    const res = await axios.post("http://localhost:3000/api/refreshToken", {}, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createAxios = (token, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        console.log(data);
        const refreshUser = data.accessToken;
        dispatch(stateSuccess(refreshUser));
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return newInstance;
};
