import React from 'react';
import './CircleLoad.css';

const CircleLoad = ({ mensagem = "Carregando..." }) => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p className="status-msg">{mensagem}</p>
        </div>
    );
}


export default CircleLoad;