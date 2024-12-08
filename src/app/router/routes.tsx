import React, { useContext } from 'react';
import { useLocation } from "react-router-dom";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import Navbar from '../components/navbar';
import UserPage from '../../features/user/userpage';
import EditUserPage from '../../features/user/edituserpage';
import AddUserPage from '../../features/user/adduserpage';
import SalePage from '../../features/sale/salepage';
import EditSalePage from '../../features/sale/editsalepage';
import DetailSalePage from '../../features/sale/detailsalepage';
import AddSalePage from '../../features/sale/addsalepage';
import ReportPage from '../../features/report/reportpage';

type Props = {};

const Routes = (props: Props) => {
    const location = useLocation();
    const views = [
        "/",
        "/users",
        "/edit-user",
        "/add-user",
        "/sales",
        "/edit-sale",
        "/detail-sale",
        "/add-sale",
        "/reports",
    ];

    return (
        <Router>
        <Route
            path="/"
            element={
            <>
                {views.includes(location.pathname) && <Navbar />}
                <Outlet />
            </>
            }
        >
            <Route path="/" element={<UserPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/edit-user" element={<EditUserPage />} />
            <Route path="/add-user" element={<AddUserPage />} />
            <Route path="/sales" element={<SalePage />} />
            <Route path="/edit-sale" element={<EditSalePage />} />
            <Route path="/detail-sale" element={<DetailSalePage />} />
            <Route path="/add-sale" element={<AddSalePage />} />
            <Route path="/reports" element={<ReportPage />} />
        </Route>
        </Router>
    );
};

export default Routes;