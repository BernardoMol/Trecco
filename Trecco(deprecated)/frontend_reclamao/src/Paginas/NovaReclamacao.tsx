// src/Paginas/NovaReclamacao.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NovaReclamacao.css";
import { apiFetch } from "../api";

const NovaReclamacao: React.FC = () => {
  const [conteudo, setConteudo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!conteudo.trim()) {
      setError("Por favor, descreva sua tarefa.");
      setLoading(false);
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    let usuarioId = null;

    if (!authToken) {
      setError("Você não está logado. Por favor, faça login novamente.");
      setLoading(false);
      navigate("/");
      return;
    }

    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        usuarioId = user.usuarioId;
        if (!usuarioId) {
          throw new Error("ID do usuário não encontrado nos dados de sessão.");
        }
      } catch (e: any) {
        setError("Erro ao obter dados do usuário. Faça login novamente.");
        setLoading(false);
        navigate("/");
        return;
      }
    } else {
      setError("Dados do usuário não encontrados. Faça login novamente.");
      setLoading(false);
      navigate("/");
      return;
    }

    const dataCriacaoReclamacao = new Date().toISOString(); // Pega a data e hora atual em formato ISO

    try {
      const response = await apiFetch(`/ControladorContexto/CTX_adicionar`, {
      // const response = await fetch('http://localhost:5197/ControladorContexto/CTX_adicionar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          conteudoReclamacao: conteudo,
          usuarioId: usuarioId,
          dataCriacaoReclamacao: dataCriacaoReclamacao // Envia a data de criação
        }),
      });

      if (response.ok) {
        // *** ÚNICA MUDANÇA ESSENCIAL AQUI ***
        // Se o backend retorna uma string simples (como "ADICIONADO"), use .text()
        const responseText = await response.text(); 
        console.log("Resposta do backend:", responseText); // Verifique o que veio

        if (responseText === "ADICIONADO") { // Confere se a mensagem esperada é "ADICIONADO"
          setSuccess("Tarefa registrada com sucesso!");
          setConteudo(""); // Limpa o campo
          
          // O backend não está retornando o objeto da reclamação.
          // Para que a lista de reclamações na página de usuário seja atualizada
          // sem exigir um novo login ou uma busca explícita, a melhor opção
          // é limpar o localStorage de reclamações. Isso fará com que a página
          // do usuário (se ela tem uma lógica de recarga) recarregue os dados.
          // OU você pode navegar e assumir que o usuário fará outro login ou a
          // pagina de usuario tem outra lógica de recarga.
          localStorage.removeItem('userReclamacoes'); // Remove as reclamações antigas

          setTimeout(() => {
            navigate("/usuario");
          }, 1500);

        } else {
          // Caso o backend retorne algo diferente de "ADICIONADO" mas ainda seja 2xx OK
          setError("Tarefa registrada, mas a resposta do servidor foi inesperada.");
        }
        // *** FIM DA MUDANÇA ESSENCIAL ***

      } else {
        // Mantém a lógica de erro para respostas não-OK (4xx, 5xx)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          setError(errorData.message || `Erro do servidor: ${response.status}`);
        } else {
          const errorText = await response.text();
          setError(errorText || `Erro do servidor: ${response.status}`);
        }
        console.error("Erro na resposta do servidor:", response.status, contentType);
      }
    } catch (networkError: any) {
      console.error("Erro de rede ao tentar registrar tarefa:", networkError);
      setError("Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate("/usuario");
  };

  return (
    <div className="nova-reclamacao-container">
      <h1>Registre sua tarefa aqui !!!</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="form-reclamacao" onSubmit={handleSubmit}>
        <textarea
          placeholder="Descreva sua tarefa..."
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
          disabled={loading}
        />
        <div className="botoes-form">
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <button type="button" onClick={handleCancelar} className="cancelar-btn" disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaReclamacao;