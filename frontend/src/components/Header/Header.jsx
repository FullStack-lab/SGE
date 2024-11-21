import { Timer, Scroll } from "phosphor-react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export function Header({children}) {
  return (
    <div className="headerContainer">
      <div className="navButtons">
        <NavLink to="/" title="Timer" className="navlink">
          <Timer size={24} className="icon"/>
          Home page
        </NavLink>
        <NavLink to="/categorias" title="Histórico" className="navlink">
          <Scroll size={24} className="icon"/>
          Categorias
        </NavLink>
        <NavLink to="/produtos" title="Histórico" className="navlink">
          <Scroll size={24} className="icon"/>
          Produtos
        </NavLink>
        <NavLink to="/movimentacoes" title="Histórico" className="navlink">
          <Scroll size={24} className="icon"/>
          Movimentações
        </NavLink>
        <NavLink to="/usuarios" title="Histórico" className="navlink">
          <Scroll size={24} className="icon"/>
          Perfil
        </NavLink>
      </div>
      <header>
        {children}
      </header>
    </div>
  );
}
