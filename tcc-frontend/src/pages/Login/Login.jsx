import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './login.css';

function Login() {
  const [numProcesso, setNumProcesso] = useState('');
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');


  const navigate = useNavigate();


  const handleSenhaChange = (e) => {
    const valor = e.target.value;
    setSenha(valor);

    // minimo 8 caractere
    if (valor.length > 0 && valor.length < 8) {
      setErroSenha('A senha é muito curta (mínimo 8 caracteres).');
    }
    // apenas letras e numeros
    else if (valor.length >= 8) {
      const temLetras = /[a-zA-Z]/.test(valor);
      const temNumeros = /[0-9]/.test(valor);

      if (!temLetras || !temNumeros) {
        setErroSenha('A senha deve conter letras e números.');
      } else {
        setErroSenha(''); // Senha aprovada
      }
    }
    else {
      setErroSenha('');
    }
  };

  const handleNumProcessoChange = (e) => {
    const valor = e.target.value;

    // Regex para digitar apenas numeros
    const apenasNumeros = valor.replace(/\D/g, "");

    if (apenasNumeros.length <= 5) {
      setNumProcesso(apenasNumeros);
    }
  };

  const handleLogin = async (e) => {
      e.preventDefault();

      // Se houver erro de validação visual na senha, trava o submit para poupar a API
      if (erroSenha) {
        toast.error("Por favor, corrija os erros na senha antes de prosseguir.");
        return;
      }

      const loadingToast = toast.loading("Verificando credenciais...");

      try {
          const response = await axios.post('http://127.0.0.1:8000/api/login', {
              num_processo: numProcesso, 
              password: senha           
          }, {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          });
         
          toast.dismiss(loadingToast);
          toast.success("Bem-vindo!");

          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Se estás a usar Sanctum/Tokens, podes guardar o token aqui também se precisares:
          // sessionStorage.setItem('token', response.data.token);

          navigate('/pages/home'); 

      } catch (error) {
          toast.dismiss(loadingToast);
          
          // Pega a mensagem da chave 'error' que configurámos nas respostas do Laravel
          const mensagem = error.response?.data?.error || "Erro ao fazer login";
          toast.error(mensagem);
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
            type="text"
            placeholder="Nº de Processo"
            className="inputForm"
            value={numProcesso}
            onChange={handleNumProcessoChange}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="inputForm"
            value={senha}
            onChange={handleSenhaChange}
            required
            
          />

          {erroSenha && (
            <span className='SMSverifyPassword'>
              {erroSenha}
            </span>
          )}
          < br/>

          <span className='SMSPassword'>
              A senha deve ter pelo menos 8 caracteres, incluindo um número e uma letra.
            </span>

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