import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isGerente } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(isGerente ? "gerente" : "funcionario")) {
        return <Navigate to="/home" />;
    }

    return <Outlet />;
};