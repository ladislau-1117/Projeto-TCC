import React from "react";
import { UserIcon } from "../../assets/icons";
import { useEffect, useState } from "react";
import './header.css';


const Header = ({ isOpen }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const dadosGuardados = sessionStorage.getItem('user');
        
        if (dadosGuardados) {
            const userObj = JSON.parse(dadosGuardados);
            const primeiroNome = userObj.name.split(' ')[0];
            setUser(primeiroNome);
        }
    }, []);
    
    return (
        <header className={`header ${isOpen ? "expanded" : "compact"}`}>
            <h2>Acervo Digital</h2>
            {user && (
                <div className="userInfo">
                    <span>
                        Olá <strong >{user}</strong> <UserIcon />
                    </span >
                </div>
            )} 
        </header>
    );
}

export default Header;