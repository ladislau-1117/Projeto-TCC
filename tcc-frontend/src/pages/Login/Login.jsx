import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './login.css';

function Login(){
    const [numProcesso, setNumProcesso] = useState('');
    const [senha, setSenha] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loadingToast = toast.loading("Entrando...");

        try {
          const response = await axios.post(
            'http://localhost/TCC_PROJETO/tcc_back/logPHP/login.php',
            { numProcesso, senha }
          );

          toast.dismiss(loadingToast);

          if (response.data.success) {

            toast.success("Login efectuado com sucesso");

            sessionStorage.setItem('user', JSON.stringify(response.data));

            setTimeout(() => {
              navigate('/pages/home');
            }, 1500);

          } else {
            toast.error(response.data.error || "Erro desconhecido");
          }

        } catch (error) {
          toast.dismiss(loadingToast);
          console.error(error);
          toast.error("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="login-screen">
            <div className="form">
                <div className='divTitle'>
                    <h3 className="labelTitle">Bem-Vindo ao Acervo Digital</h3>
                    <p className="labelSubtitle">Preencha com os seus dados</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <input
                        type="number"
                        placeholder="Nº de Processo"
                        className="inputForm"
                        onChange={(e) => setNumProcesso(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        className="inputForm"
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    
                    <button className="buttonForm">Entrar</button>
                </form>

                <Link to="" className="labelForgotPass">
                  Esqueceu a sua senha?
                </Link>

                <p className="linkRegister">
                  Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 