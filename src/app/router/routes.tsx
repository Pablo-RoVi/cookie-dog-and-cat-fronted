import React, { useContext, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import Login from '../../features/auth/login' ;
import Navbar from '../components/navbar';
import UserPage from '../../features/user/userpage';
import EditUserPage from '../../features/user/edituserpage';
import AddUserPage from '../../features/user/adduserpage';
import SalePage from '../../features/sale/salepage';
import EditSalePage from '../../features/sale/editsalepage';
import DetailSalePage from '../../features/sale/detailsalepage';
import AddSalePage from '../../features/sale/addsalepage';
import ReportPage from '../../features/report/reportpage';
import { AuthProvider,useAuth } from "../context/authcontext";

import ProductPage from '../../features/product/productpage';
import NotFound from '../../features/error/notfound';
import EditProductPage from '../../features/product/editproductpage';
import AddProductPage from '../../features/product/addproductpage';

type Props = {};

const RoleBasedRoute = ({ roles, children }: { roles: number[]; children: React.ReactNode }) => {
  const role = parseInt(localStorage.getItem("role") || "0", 10);
  console.log(localStorage.getItem("role"));
  if (!roles.includes(role)) {
    return <Navigate to="/" replace />; // Redirige si el rol no coincide
  }
  return <>{children}</>;
};


const PrivateRoutes = () => {
  const { authenticated } = useAuth();
  return authenticated ? <Outlet /> : <Navigate to="/" replace />;
};


  
const Routes = (props: Props) => {
      const { authenticated } = useAuth();
    const location = useLocation();
    const views = [
        "/Login",
        "/users",
        "/edit-user",
        "/add-user",
        "/sales",
        "/edit-sale",
        "/detail-sale",
        "/add-sale",
        "/reports",
        "/products",
        "/products/edit-product/1",
        "/products/add-product",
        "*"
    ];
    return (
      <AuthProvider>
        <Router>
          <Route 
            path="/" 
            element={authenticated ? <Navigate to="/users" replace /> : <Login />} />
        <Route
            path="/"
            element={
            <>
                {views.includes(location.pathname) && <Navbar />}
                <Outlet />
            </>
            } 
        >
          <Route element={<PrivateRoutes />}>
              <Route path="/users" element={<UserPage />} />
              <Route path="/edit-user" element={<EditUserPage />} />
              <Route path="/add-user" element={<AddUserPage />} />
              <Route path="/sales" element={<SalePage />} />
              <Route path="/edit-sale" element={<EditSalePage />} />
              <Route path="/detail-sale" element={<DetailSalePage />} />
              <Route path="/add-sale" element={<AddSalePage />} />
              <Route path="/reports"element={ <RoleBasedRoute roles={[1]}> <ReportPage /> </RoleBasedRoute>}/>
          </Route>
            <Route path="/" element={<UserPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/edit-user" element={<EditUserPage />} />
            <Route path="/add-user" element={<AddUserPage />} />
            <Route path="/sales" element={<SalePage />} />
            <Route path="/edit-sale" element={<EditSalePage />} />
            <Route path="/detail-sale" element={<DetailSalePage />} />
            <Route path="/add-sale" element={<AddSalePage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/products" element={<Outlet />}>
                <Route path="" element={<ProductPage />} />
                <Route path="edit-product/:id" element={<EditProductPage />} />
                <Route path="add-product" element={<AddProductPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Route>
        </Router>
      </AuthProvider>
    );
};

export default Routes;