import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Importante mudar para NavLink
import { MenuIcon, HomeIcon, SearchIcon, RegistIcon, Statistics, CatalogIcon, LogRegistIcon, LogoutIcon } from "../../assets/icons";
import toast from "react-hot-toast"

import '../Sidebar/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
   

    
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('user'); 
        
        window.location.href = "/"; 
        
       
        toast.success("Sessão terminada!");
    }

    return (
        <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`} id="sidebarT">

            <div className="IconMenuSidebar" onClick={toggleSidebar}>
                <MenuIcon />
            </div>

            <nav>
                
                <NavLink to="/pages/home" className={({ isActive }) => isActive ? "navItem active" : "navItem"} end>
                    <HomeIcon /> 
                    {isOpen && <span>Dashboard</span>}
                </NavLink>

                <NavLink to="/pages/pesquisar" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <SearchIcon />
                    {isOpen && <span>Pesquisar</span>}
                </NavLink>

                <NavLink to="/pages/registerTcc" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <RegistIcon /> 
                    {isOpen && <span>Registar</span>}
                </NavLink>

                <NavLink to="/pages/analiseAcademica" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <Statistics /> 
                    {isOpen && <span>Análise Acadêmica</span>}
                </NavLink>

                <NavLink to="/pages/historicMov" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <CatalogIcon />
                    {isOpen && <span>Registro de Actividade</span>}
                </NavLink>

                <NavLink to="/pages/registLog" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <LogRegistIcon />
                    {isOpen && <span>Registro de Login</span>}
                </NavLink>
                <NavLink to="/pages/gestaoUsuarios" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
                    <LogRegistIcon />
                    {isOpen && <span>Gestão de Usuário</span>}
                </NavLink>

            </nav>
            
                <div className="btnLogout" onClick={handleLogout}>
                    <LogoutIcon />
                    {isOpen && <span>Sair</span>}
                </div>
        </aside>
    );
}

export default Sidebar;