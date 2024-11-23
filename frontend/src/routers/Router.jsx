import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Produto from '../pages/Produto';
import Categoria from '../pages/Categoria';
import Movimentacao from '../pages/Movimentacao';
import Usuario from '../pages/Usuario';
import Home from '../pages/Home';
import SignIn from '../pages/SigIn';
import { ProtectedRoute } from '../components/ProtectedRoute';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Rota de Login */}
                <Route path="/login" element={<SignIn />} />

                {/* Rota raiz redireciona para Login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Rotas protegidas */}
                <Route element={<ProtectedRoute allowedRoles={["gerente", "funcionario"]} />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/produtos" element={<Produto />} />
                    <Route path="/categorias" element={<Categoria />} />
                    <Route path="/movimentacoes" element={<Movimentacao />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={["gerente"]} />}>
                    <Route path="/usuarios" element={<Usuario />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;