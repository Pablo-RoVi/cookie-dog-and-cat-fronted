import axios, { AxiosResponse } from "axios";
import emailjs from "@emailjs/browser";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const responseBody = (response: AxiosResponse) => response;

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string, body: {}) => axios.delete(url, body),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
};

const Auth = {
  login: (form: any) => requests.post("Auth/login", form),
};

const User = {
  list: () => requests.get("user/getUsers"),
  add: (form: any) => requests.post("user/RegisterUser", form),
  update: (form: any) => requests.put("user/UpdateUser", form),
  active: () => requests.get("user/ActiveUsers"),
  getByNickName: (nickName: string) => requests.get(`user/GetUserNameByNickName/${nickName}`),
  changeState: (id: string) => requests.put(`user/ChangeState/${id}`, id),
  changePasswordEmployee: (form: any) => requests.put("user/ChangePasswordEmployee", form),
  changePasswordAdmin: (form: any) => requests.put("user/ChangePasswordAdmin", form),
};

const Product = {
  list: () => requests.get("product/allProducts"),
  add: (form: any) => requests.post("product/addProduct", form),
  update: (form: any, id: string) => requests.put(`product/editProduct/${id}`, form),
  delete: (unique_id: string) => requests.delete(`product/deleteProduct/${unique_id}`, unique_id),
  available: () => requests.get("product/availableProducts"),
};

const Sale = {
  list: () => requests.get("sale/getSales"),
  add: (form: any) => requests.post("sale/addSale", form),
  edit: (form: any, id: string) => requests.put("sale/editSale", form),
  delete: (id: string) => requests.delete(`sale/deleteSale/${id}`, id),
  getPaymentMethods: () => requests.get("sale/GetPaymentMethods"),
  getByDate: (form: any) => requests.post("sale/getSalesByDate", form),
};

const Brand = {
  list: () => requests.get("brand/getBrands"),
  add: (form: any) => requests.post("brand/addBrand", form),
  update: (form: any, id: string) => requests.put(`brand/editBrand/${id}`, form),
  delete: (id: string) => requests.delete(`brand/deleteBrand/${id}`, id),
};

const SendEmail = (userEmail: string, adminName: string, messsage: string) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
      process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
      {
        userEmail: userEmail,
        adminName: adminName,
        todayDate: new Date().toLocaleDateString(),
        message: messsage,
      },
      process.env.REACT_APP_EMAIL_JS_PUBLIC_ID
    )
    .then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
};

const agent = { Auth, User, Product, Sale, Brand, SendEmail };

export default agent;
