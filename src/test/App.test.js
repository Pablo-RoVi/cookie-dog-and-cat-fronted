import { render, screen } from '@testing-library/react';
import App from '../app/layout/App';
import Login from '../features/auth/login';
import NotFound from '../features/error/notfound';
import ProductPage from '../features/product/productpage';
import AddProductPage from '../features/product/addproductpage';
import EditProductPage from '../features/product/editproductpage';
import ReportPage from '../features/report/reportpage';
import SalePage from '../features/sale/salepage';
import AddSalesPage from '../features/sale/editsalepage';
import UserPage from '../features/user/userpage';
import AddUserPage from '../features/user/adduserpage';
import EditUserPage from '../features/user/edituserpage';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
