import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const isAuthenticated = !!sessionStorage.getItem("loggedIn"); // Verifica se o usuário está autenticado

    if (!isAuthenticated) {
        // Se não estiver autenticado, redireciona para a página de login
        return <Navigate to="/login" />;
    }

    // Se estiver autenticado, renderiza as rotas aninhadas (com Outlet)
    return <Outlet />;
};