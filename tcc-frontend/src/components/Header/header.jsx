import React, { useEffect, useRef, useState } from "react";
import { UserIcon } from "../../assets/icons";
import ProfileModal from "../PerfilUser/PerfilModal"; // Puxa o componente isolado da pasta dele
import './header.css';

const Header = ({ isOpen }) => {
    const dropdownRef = useRef(null);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalMode, setModalMode] = useState('closed'); // Controla o estado: closed, view, edit

    useEffect(() => {
        const dadosGuardados = sessionStorage.getItem('user');
        if (dadosGuardados) {
            setUser(JSON.parse(dadosGuardados));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    useEffect(() => {
        const fecharDropdownFora = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', fecharDropdownFora);
        }

        return () => {
            document.removeEventListener('mousedown', fecharDropdownFora);
        };
    }, [isDropdownOpen]);
    
    return (
        <header className={`header ${isOpen ? "expanded" : "compact"}`}>
            <h2>Acervo Digital</h2>
            {user && (
                <div className="userInfoWrapper" ref={dropdownRef}>
                    <div className="userInfo" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <span>
                            Olá <strong>{user.name.split(' ')[0]}</strong> <UserIcon />
                        </span>
                    </div>

                    {isDropdownOpen && (
                        <div className="headerDropdownMenu">
                            <div className="dropdownUserInfo">
                                <p className="dropdownName">{user.name}</p>
                                <p className="dropdownEmail">{user.email}</p>
                            </div>
                            <hr />
                            <ul>
                                <li onClick={() => { setModalMode('view'); setIsDropdownOpen(false); }}>
                                    <i className="fas fa-user-circle"></i> Ver Perfil
                                </li>
                                <li onClick={() => setIsDropdownOpen(false)}>
                                    <i className="fas fa-cog"></i> Configurações do Sistema
                                </li>
                                <li className="logoutItem" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Sair
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )} 

            {/* Chamas o componente de forma limpa passando os gatilhos */}
            {modalMode !== 'closed' && (
                <ProfileModal 
                    mode={modalMode} 
                    setMode={setModalMode}
                    currentUser={user}
                    refreshUser={(dadosNovos) => {
                        setUser(dadosNovos);
                        sessionStorage.setItem('user', JSON.stringify(dadosNovos));
                    }}
                />
            )}
        </header>
    );
}

export default Header;