import React, { useContext } from "react";
import { Timer, Scroll } from "phosphor-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./Header.css";

export function Header({ children }) {
  const { user, isGerente } = useContext(AuthContext);

  return (
    <div className="headerContainer">
      <div className="navButtons">
        <NavLink to="/home" title="Timer" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
          <Timer size={24} className="icon" />
          Home page
        </NavLink>
        <NavLink to="/categorias" title="Histórico" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
          <Scroll size={24} className="icon" />
          Categorias
        </NavLink>
        <NavLink to="/produtos" title="Histórico" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
          <Scroll size={24} className="icon" />
          Produtos
        </NavLink>
        <NavLink to="/movimentacoes" title="Histórico" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
          <Scroll size={24} className="icon" />
          Movimentações
        </NavLink>
        {isGerente && (
          <NavLink to="/usuarios" title="Histórico" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
            <Scroll size={24} className="icon" />
            Usuarios
          </NavLink>
        )}
      </div>
      <header>
        {user && (
          <div className="welcomeMessage">
            <p>Olá, {user.nome}! Você é {isGerente ? "Gerente" : "Funcionário"}.</p>
          </div>
        )}
        {children}
      </header>
    </div>
  );
}