import React, { useContext } from 'react';
import { useLocation } from "react-router-dom";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import Navbar from '../components/navbar';
import UserPage from '../../features/user/userpage';
import EditUserPage from '../../features/user/edituserpage';
import AddUserPage from '../../features/user/adduserpage';

type Props = {};

const Routes = (props: Props) => {
    const location = useLocation();
    const views = ["/", "/edit-profile", "/interactive-mesh", "/my-progress"];

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
        </Route>
        </Router>
    );
};

export default Routes;