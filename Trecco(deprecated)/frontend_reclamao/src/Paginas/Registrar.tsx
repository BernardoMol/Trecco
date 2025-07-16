import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- ADICIONE ESTA LINHA
import './Registrar.css'; // Importa o arquivo CSS
import { apiFetch } from '../api';

const Registrar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado para controle de carregamento

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    setError(''); // Limpa mensagens de erro anteriores
    setSuccess(''); // Limpa mensagens de sucesso anteriores
    setLoading(true); // Começa o carregamento


    if (!email || !username || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('A senha e a confirmação de senha não coincidem.');
      return;
    }

    try {
      const response = await apiFetch(`/AuthControler/register`, {
      // const response = await fetch('http://localhost:5197/AuthControler/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NomeUsuario: username,
          EmailUsuario: email,
          SenhaUsuario: password,
        }),
      });

      if (response.ok) { // Verifica se a resposta foi bem-sucedida (status 2xx)
        const data = await response.json(); // Se o backend retornar algum dado de sucesso
        console.log('Registro bem-sucedido:', data);
        setSuccess('Registro realizado com sucesso! Você será redirecionado...');

        // Mantém a mensagem de sucesso por 3 segundos e depois redireciona
        setTimeout(() => {
          // Limpa os campos após o redirecionamento (opcional, mas bom para reuso)
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          navigate('/'); // Redireciona para a página de login
        }, 3000);

      } else { // Se a resposta não for 2xx (ex: 400, 500)
        const errorData = await response.json(); // Assume que o backend retorna um JSON de erro
        console.error('Erro no registro:', errorData);
        setError(errorData.message || 'Erro ao registrar. Tente novamente.'); // Exibe mensagem de erro do backend ou genérica
      }

    } catch (networkError) { // Captura erros de rede (servidor offline, CORS, etc.)
      console.error('Erro de rede ao registrar:', networkError);
      setError('Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
    } finally {
      setLoading(false); // Sempre termina o carregamento
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Criar Conta</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">Registrar</button>
      </form>
    </div>
  );
};

export default Registrar;