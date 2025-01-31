import React from "react";
import { useLocation } from "react-router-dom";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import Login from "../../features/auth/login";
import Navbar from "../components/navbar";
import UserPage from "../../features/user/userpage";
import EditUserPage from "../../features/user/edituserpage";
import AddUserPage from "../../features/user/adduserpage";
import SalePage from "../../features/sale/salepage";
import EditSalePage from "../../features/sale/editsalepage";
import DetailSalePage from "../../features/sale/detailsalepage";
import AddSalePage from "../../features/sale/addsalepage";
import ReportPage from "../../features/report/reportpage";
import { AuthProvider, useAuth } from "../context/authcontext";
import ReportSalesPDF from "../../features/report/reportsalespdf";
import ProductPage from "../../features/product/productpage";
import NotFound from "../../features/error/notfound";
import EditProductPage from "../../features/product/editproductpage";
import AddProductPage from "../../features/product/addproductpage";

const RoleBasedRoute = ({
  roles,
  children,
  redirectTo = "/",
}: {
  roles: number[];
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  const { userRoleId } = useAuth();

  if (!roles.includes(userRoleId)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

const PrivateRoutes = () => {
  const { authenticated } = useAuth();
  return authenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const Routes = () => {
  const { authenticated } = useAuth();
  const location = useLocation();
  const views = [
    "/users",
    "/edit-user",
    "/add-user",
    "/sales",
    "/edit-sale",
    "/detail-sale",
    "/add-sale",
    "/reports",
    "/products",
    "/products/edit-product",
    "/products/add-product",
    "*",
  ];
  return (
    <AuthProvider>
      <Router>
        <Route
          path="/"
          element={authenticated ? <Navigate to="/sales" replace /> : <Login />}
        />
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
            <Route
              path="/users"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/sales">
                  {" "}
                  <UserPage />{" "}
                </RoleBasedRoute>
              }
            />
            <Route
              path="/edit-user"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/sales">
                  {" "}
                  <EditUserPage />{" "}
                </RoleBasedRoute>
              }
            />

            <Route
              path="/add-user"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/sales">
                  {" "}
                  <AddUserPage />{" "}
                </RoleBasedRoute>
              }
            />
            <Route path="/products" element={<ProductPage />} />
            <Route
              path="/products/edit-product"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/products">
                  {" "}
                  <EditProductPage />{" "}
                </RoleBasedRoute>
              }
            />
            <Route path="/products/add-product" element={<AddProductPage />} />
            <Route
              path="/sales"
              element={
                <RoleBasedRoute roles={[1, 2]} redirectTo="/sales">
                  {" "}
                  <SalePage />{" "}
                </RoleBasedRoute>
              }
            />
            <Route
              path="/edit-sale"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/sales">
                  {" "}
                  <EditSalePage />{" "}
                </RoleBasedRoute>
              }
            />
            <Route path="/add-sale" element={<AddSalePage />} />
            <Route path="/detail-sale" element={<DetailSalePage />} />
            <Route
              path="/reports"
              element={
                <RoleBasedRoute roles={[1]} redirectTo="/">
                  {" "}
                  <ReportPage />{" "}
                </RoleBasedRoute>
              }
            />
          </Route>
          <Route path="/reports/pdf?" element={<ReportSalesPDF />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Router>
    </AuthProvider>
  );
};

export default Routes;
