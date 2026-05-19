import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Register = () => {
    const [nome, setNome] = useState('');
    const [numProcesso, setNumProcesso] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    const navigate = useNavigate();


    const handleNomeChange = (e) => {
        const valor = e.target.value;
        // Regex para inserir apenas letras
        const apenasLetras = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

        // máximo 50 caracteres
        if (apenasLetras.length <= 50) {
            setNome(apenasLetras);
        }
    };

    // 2. VALIDAÇÃO DE PROCESSO (Apenas 5 números)
    const handleProcessoChange = (e) => {
        const apenasNumeros = e.target.value.replace(/\D/g, "");
        if (apenasNumeros.length <= 5) {
            setNumProcesso(apenasNumeros);
        }
    };

    // 3. VALIDAÇÃO DE SENHA (Mínimo 8 caracteres, letras e números)
    const handleSenhaChange = (e) => {
        const valor = e.target.value;
        setSenha(valor);

        if (valor.length > 0 && valor.length < 8) {
            setErroSenha('A senha é muito curta (mínimo 8 caracteres).');
        } else if (valor.length >= 8) {
            const temLetras = /[a-zA-Z]/.test(valor);
            const temNumeros = /[0-9]/.test(valor);
            if (!temLetras || !temNumeros) {
                setErroSenha('A senha deve conter letras e números.');
            } else {
                setErroSenha('');
            }
        } else {
            setErroSenha('');
        }
    };

    // 4. LÓGICA DE CONFIRMAÇÃO DE SENHA
    const senhasCoincidem = senha === confirmarSenha && confirmarSenha.length > 0;

    const handleRegister = async (e) => {
        e.preventDefault();

        const loadingToast = toast.loading("Registando...");


        if (senha !== confirmarSenha) {
            toast.error("As senhas não coincidem!");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', {
                name: nome,
                numProcesso: numProcesso,
                email: email,
                password: senha
            });

            toast.dismiss(loadingToast);


            if (response.data.message) {
                toast.success("Usuário cadastrado com sucesso");
                navigate("/");
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.log("Erro do Laravel:", error.response.data);
            toast.error("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="login-screen">
            <div className="form">
                <div className='divTitle'>
                    <h3 className="labelTitle">Crie sua conta</h3>
                    <p className="labelSubtitle">Preencha com os seus dados pessoais</p>
                </div>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Nome Completo" className="inputForm"
                        value={nome} onChange={handleNomeChange} required />

                    <input type="text" placeholder="Nº de Processo " className="inputForm"
                        value={numProcesso} onChange={handleProcessoChange} required />

                    <input type="email" placeholder="E-mail" className="inputForm"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <input type="password" placeholder="Senha" className="inputForm"
                        value={senha} onChange={handleSenhaChange} required />

                    <input type="password" placeholder="Confirmar Senha" className="inputForm"
                        value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required
                        style={{
                            borderColor: confirmarSenha.length > 0 ? (senhasCoincidem ? '#2ecc71' : '#ff4d4d') : ''
                        }} />

                    {/* Mensagens de Feedback */}
                    {erroSenha && <p style={{ color: '#ff4d4d', fontSize: '12px' }}>{erroSenha}</p>}

                    {confirmarSenha.length > 0 && (
                        <p style={{ color: senhasCoincidem ? '#2ecc71' : '#ff4d4d', fontSize: '12px' }}>
                            {senhasCoincidem ? "As senhas coincidem!" : "As senhas não coincidem."}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="buttonForm"

                    >
                        Registar
                    </button>
                </form>
                <p className="linkRegister">Já tem conta? <Link to="/">Faça Login</Link></p>
            </div>
        </div>
    );
};

export default Register;