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
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string, body: {}) => axios.delete(url,body),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
};

const Auth = {
  login: (form: any) => requests.post("Auth/login", form),
  logout: (form: any) => requests.post("Auth/logout", form),
};

const Users = {
  list: () => requests.get("user/"),
  active: () => requests.get("user/ActiveUsers"),
  getNickName: () => requests.get("user/GetUserNameByNickName"),
  registerUser: (form: any) => requests.post("user/RegisterUser", form),
  updateUser: (form: any) => requests.put("user/UpdateUser", form),
  changeState: (id: string) => requests.put(`user/ChangeState/${id}`, id),
  changePasswordEmployee: (form: any) => requests.post("user/ChangePasswordEmployee", form),
  changePasswordAdmin: (form: any) => requests.post("user/ChangePasswordAdmin", form),
};

const Products = {
  list: () => requests.get("product/allProducts"),
  available: () => requests.get("product/availableProducts"),
  //create: (form: any) => requests.post("product/", form),
  update: (form: any) => requests.put("product/editProduct/{id}", form),
  deleteProduct: (unique_id:string ) => requests.delete(`product/deleteProduct/${unique_id}`,unique_id),
};

const agent = { Auth, requests, Users, Products};

export default agent;