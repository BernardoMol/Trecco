// src/Paginas/Login.tsx
import React, { useState } from "react"; // <--- Garanta que esta linha está descomentada
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Contexts/AuthContext'; // <--- Garanta que esta linha está descomentada e com o caminho correto
                                                  // (Provavelmente '../../contexts/AuthContext' se Login.tsx está em 'src/Paginas'
                                                  // e AuthContext.tsx está em 'src/contexts')
import "./Login.css";
import { apiFetch } from '../api'
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- Garanta que esta linha está descomentada. Ela pega a função 'login' do seu AuthContext.

  const [identificador, setIdentificador] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!identificador || !senhaUsuario) {
      setError('Por favor, preencha seu email/nome de usuário e a senha.');
      setLoading(false);
      return;
    }

    try {
      // Confirme que esta URL é a do seu backend
      const response = await apiFetch('/AuthControler/login', {
      // const response = await fetch('http://localhost:5197/AuthControler/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Identificador: identificador,
          SenhaUsuario: senhaUsuario,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido:', data);

        // AQUI ESTÁ A MUDANÇA MAIS IMPORTANTE:
        // Chame a função 'login' do contexto para atualizar o estado global
        // e armazenar os dados no localStorage.
        // O backend deve enviar: data.token, data.user, e data.reclamacoes
        // O '|| []' garante que reclamacoesData seja um array mesmo que 'data.reclamacoes' seja undefined/null
        login(data.token, data.user, data.reclamacoes || []);

        setSuccess('Login realizado com sucesso! Redirecionando...');

        setTimeout(() => {
          navigate("/usuario"); // Redireciona para a página de usuário
        }, 1500);

      } else {
        let errorMessage = 'Credenciais inválidas ou erro no servidor.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.detail || 'Erro desconhecido.';
        } catch (jsonError) {
            errorMessage = `Erro ${response.status}: ${response.statusText || 'Resposta inesperada do servidor.'}`;
        }
        console.error('Erro no login:', errorMessage);
        setError(errorMessage);
      }
    } catch (networkError) {
      console.error('Erro de rede ao tentar fazer login:', networkError);
      setError('Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/registrar"); // Redireciona para a página de registro
  };

  return (
    <div className="login-container">
      <div className="welcome-banner">Bem Vindo ao Trecco!</div>
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <input
          type="text"
          placeholder="Email ou Nome de Usuário"
          className="login-input"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          className="login-input"
          value={senhaUsuario}
          onChange={(e) => setSenhaUsuario(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleLogin} className="login-button" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button onClick={handleRegister} className="register-button" disabled={loading}>
          Registrar
        </button>
        <p className="login-forgot">
          <a href="#" className="login-link">
            Esqueceu sua senha?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;