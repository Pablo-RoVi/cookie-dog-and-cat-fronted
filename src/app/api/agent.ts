import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) =>axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
};

const Auth = {
  login: (form: any) => requests.post("Auth/login", form),
  logout: (form: any) => requests.post("Auth/logout", form),
};

const Users = {
  list: () => requests.get("user/"),
  active: () => requests.get("user/ActiveUsers"),
  updateUser: (form: any) => requests.post("user/UpdateUser", form),
  changeState: (form: any) => requests.post("user/ChangeState/", form),
  changePasswordEmployee: (form: any) => requests.post("user/ChangePasswordEmployee", form),
  changePasswordAdmin: (form: any) => requests.post("user/ChangePasswordAdmin", form),
};

const agent = { Auth, requests, Users };

export default agent;