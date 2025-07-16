import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Usuario.css";
import { apiFetch } from "../api";

const Usuario: React.FC = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [reclamacoesData, setReclamacoesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  // Estado para a URL da imagem de perfil
  const [profileImageUrl, setProfileImageUrl] = useState<string>("https://static.vecteezy.com/ti/vetor-gratis/p1/5544753-perfil-icone-design-gratis-vetor.jpg");

  // Ref para o input de arquivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para buscar as reclamações do backend
  const fetchReclamacoesFromServer = async (authToken: string, usuarioId: number) => {
    try {
      const response = await apiFetch(`/ControladorContexto/obterPorUsuario/${usuarioId}`, {
      // const response = await fetch(`http://localhost:5197/ControladorContexto/obterPorUsuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } else {
        const errorText = await response.text();
        console.error("Erro ao buscar reclamações do backend:", errorText);
        throw new Error(`Erro ao carregar tarefas do servidor: ${errorText || response.statusText}`);
      }
    } catch (e: any) {
      console.error("Erro de rede ou ao buscar reclamações:", e);
      throw new Error("Erro de rede ao carregar tarefas. Tente novamente.");
    }
  };

  // --- NOVA FUNÇÃO PARA UPLOAD DA IMAGEM PARA O BACKEND ---
  const uploadProfileImage = async (file: File) => {
    setError('');
    setSuccess('');
    if (!userData || !userData.usuarioId) {
      setError("Dados do usuário não disponíveis para upload da imagem.");
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError("Autenticação necessária para upload de imagem.");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append('imagem', file); // 'imagem' deve corresponder ao nome do parâmetro no seu endpoint C#

    try {
      // Usa o endpoint que você me passou: [HttpPut("upload-imagem-perfil/{usuarioId}")]
      const response = await apiFetch(`/AuthControler/upload-imagem-perfil/${userData.usuarioId}`, {
      // const response = await fetch(`http://localhost:5197/AuthControler/upload-imagem-perfil/${userData.usuarioId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // 'Content-Type': 'multipart/form-data' NÃO DEVE SER DEFINIDO AQUI!
          // O navegador cuida disso automaticamente ao usar FormData.
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("URL recebida do backend:", result.imageUrl);
        setSuccess("Imagem de perfil atualizada com sucesso!");
        // Atualiza a URL da imagem no estado do componente
        setProfileImageUrl("https://trecco.onrender.com"+result.imageUrl);
        // setProfileImageUrl("http://localhost:5197"+result.imageUrl);

        // Atualiza o userData no localStorage com a nova URL da imagem
        const updatedUserData = { ...userData, imagemUsuario: result.imageUrl };
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.log("a imagem esta aqui")
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await response.text();
        setError(`Erro ao fazer upload da imagem: ${errorText || response.statusText}`);
        console.error("Erro no upload da imagem:", errorText);
      }
    } catch (e: any) {
      console.error("Erro de rede ou ao fazer upload da imagem:", e);
      setError("Erro de rede ao fazer upload da imagem. Tente novamente.");
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---


  // Efeito principal para carregar dados do usuário E BUSCAR RECLAMAÇÕES DO BACKEND
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      const storedUserData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        navigate("/");
        setLoading(false);
        return;
      }

      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);

          // **** ATUALIZADO: Carrega a imagem de perfil do usuário se ela existir ****
          if (parsedUserData.imagemUsuario) {
            setProfileImageUrl("https://trecco.onrender.com"+parsedUserData.imagemUsuario);
            // setProfileImageUrl("http://localhost:5197"+parsedUserData.imagemUsuario);
            console.log("a imagem existe")
          } else {
            // Se não houver imagem do usuário, volta para a padrão
            setProfileImageUrl("https://static.vecteezy.com/ti/vetor-gratis/p1/5544753-perfil-icone-design-gratis-vetor.jpg");
          }

          const fetchedReclamacoes = await fetchReclamacoesFromServer(authToken, parsedUserData.usuarioId);
          setReclamacoesData(fetchedReclamacoes);
          localStorage.setItem('userReclamacoes', JSON.stringify(fetchedReclamacoes));

        } catch (e: any) {
          console.error("Erro no carregamento inicial da página do usuário:", e);
          setError(`Erro: ${e.message}`);
          localStorage.removeItem('userData');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userReclamacoes');
          navigate("/");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Dados do usuário não encontrados. Faça login novamente.");
        localStorage.removeItem('authToken');
        navigate("/");
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Função para lidar com o clique na imagem de perfil
  const handleImageClick = () => {
    fileInputRef.current?.click(); // Abre o seletor de arquivos
  };

  // Função para lidar com a seleção de um arquivo de imagem
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Exibe a imagem temporariamente no frontend
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // **** CHAMA A FUNÇÃO DE UPLOAD PARA O BACKEND AQUI ****
      uploadProfileImage(file);
    }
  };

  const handleNovaTarefa = () => {
    navigate("/nova-reclamacao");
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userReclamacoes');
    setUserData(null);
    setReclamacoesData([]);
    navigate("/");
  };

  const handleDeleteReclamacao = async (idReclamacao: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta reclamação?")) {
      return;
    }

    setError('');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !userData) {
      setError("Autenticação inválida. Faça login novamente.");
      navigate("/");
      return;
    }

    try {
        const response = await apiFetch(`/ControladorContexto/CTX_deletar/id=${idReclamacao}`, {
      // const response = await fetch(`http://localhost:5197/ControladorContexto/CTX_deletar/id=${idReclamacao}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        setSuccess("Tarefa excluída com sucesso!");
        const updatedReclamacoes = await fetchReclamacoesFromServer(authToken, userData.usuarioId);
        setReclamacoesData(updatedReclamacoes);
        localStorage.setItem('userReclamacoes', JSON.stringify(updatedReclamacoes));
        setTimeout(() => setSuccess(''), 3000);
        console.log(`Reclamação ${idReclamacao} excluída com sucesso!`);
      } else {
        const errorText = await response.text();
        setError(errorText || `Erro ao excluir reclamação ${idReclamacao}.`);
      }
    } catch (networkError: any) {
      console.error('Erro de rede ao tentar excluir:', networkError);
      setError('Erro de rede ao excluir reclamação. Tente novamente.');
    }
  };

  const handleEditClick = (reclamacao: any) => {
    setEditingId(reclamacao.idReclamacao);
    setEditText(reclamacao.conteudoReclamacao);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (idReclamacao: number) => {
    if (!editText.trim()) {
      setError("O conteúdo da reclamação não pode ser vazio.");
      return;
    }

    setError('');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || !userData) {
      setError("Autenticação inválida. Faça login novamente.");
      navigate("/");
      return;
    }

    try {
      const response = await apiFetch(`/ControladorContexto/CTX_alterar/id=${idReclamacao}`, {
      // const response = await fetch(`http://localhost:5197/ControladorContexto/CTX_alterar/id=${idReclamacao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ conteudoReclamacao: editText, UsuarioId: userData.usuarioId })
      });

      if (response.ok) {
        setSuccess("Tarefa editada com sucesso!");
        const updatedReclamacoes = await fetchReclamacoesFromServer(authToken, userData.usuarioId);
        setReclamacoesData(updatedReclamacoes);
        localStorage.setItem('userReclamacoes', JSON.stringify(updatedReclamacoes));

        setEditingId(null);
        setEditText('');
        setTimeout(() => setSuccess(''), 3000);
        console.log(`Reclamação ${idReclamacao} editada com sucesso!`);
      } else {
        const errorText = await response.text();
        setError(errorText || `Erro ao editar reclamação ${idReclamacao}.`);
      }
    } catch (networkError: any) {
      console.error('Erro de rede ao tentar editar:', networkError);
      setError('Erro de rede ao editar reclamação. Tente novamente.');
    }
  };

  if (loading || !userData) {
    return (
      <div className="usuario-container">
        <p>Carregando informações do usuário e tarefas...</p>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="usuario-container">
      <aside className="perfil-coluna">
        <div className="perfil-bola" onClick={handleImageClick}>
          <img src={profileImageUrl} alt="Perfil" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="perfil-info">
          <h2>{userData.nomeUsuario}</h2>
          <p>{userData.emailUsuario}</p>
        </div>
        <button className="reclamar-btn" onClick={handleNovaTarefa}>
          Registrar TAREFA !!!
        </button>
        <button className="sair-btn" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="reclamacoes-coluna">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {reclamacoesData && reclamacoesData.length > 0 ? (
          reclamacoesData.map((reclamacao: any, i: number) => (
            <div key={reclamacao.idReclamacao || i} className="cartao-reclamacao">
              <div className="conteudo-reclamacao">
                <div>
                  <h3>Tarefa {i + 1}</h3>
                  <h3>Data {new Date(reclamacao.dataCriacaoReclamacao).toLocaleDateString('pt-BR')}</h3>

                  {editingId === reclamacao.idReclamacao ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-input"
                      />
                      <button onClick={() => handleSaveEdit(reclamacao.idReclamacao)}>Salvar</button>
                      <button onClick={handleCancelEdit}>Cancelar</button>
                    </>
                  ) : (
                    <p>{reclamacao.conteudoReclamacao}</p>
                  )}
                </div>
                <div className="acoes-reclamacao">
                  {editingId === reclamacao.idReclamacao ? null : (
                    <>
                      <span title="Editar" onClick={() => handleEditClick(reclamacao)}>✏️</span>
                      <span title="Excluir" onClick={() => handleDeleteReclamacao(reclamacao.idReclamacao)}>❌</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma reclamação encontrada para este usuário.</p>
        )}
      </main>
    </div>
  );
};

export default Usuario;

// import React from "react";
// import "./Usuario.css";

// const Usuario: React.FC = () => {
// //   const imagemPerfil = "https://cdn-icons-png.flaticon.com/512/3736/3736502.png";
//   const imagemPerfil = "https://static.vecteezy.com/ti/vetor-gratis/p1/5544753-perfil-icone-design-gratis-vetor.jpg";
//   const nomeUsuario = "João Silva";
//   const emailUsuario = "joao.silva@email.com";

//   return (
//     <div className="usuario-container">
//       <aside className="perfil-coluna">
//         <div className="perfil-bola">
//           <img src={imagemPerfil} alt="Perfil" />
//         </div>
//         <div className="perfil-info">
//           <h2>{nomeUsuario}</h2>
//           <p>{emailUsuario}</p>
//         </div>
//       </aside>

//       <main className="reclamacoes-coluna">
//         {[...Array(20)].map((_, i) => (
//           <div key={i} className="cartao-reclamacao">
//             <h3>Reclamação {i + 1}</h3>
//             <h3>Data {i + 1}</h3>
//             <p>Descrição da reclamação {i + 1}</p>
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default Usuario;




// import React from "react";
// import "./Usuario.css";

// type Reclamação = {
//   id: number;
//   titulo: string;
//   descricao: string;
// };

// const reclamacoesExemplo: Reclamação[] = [
//   { id: 1, titulo: "Reclamação 1", descricao: "Descrição da reclamação 1" },
//   { id: 2, titulo: "Reclamação 2", descricao: "Descrição da reclamação 2" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   { id: 3, titulo: "Reclamação 3", descricao: "Descrição da reclamação 3" },
//   // Adicione mais para testar o scroll
// ];

// const Usuario: React.FC = () => {
//   const imagemPerfil = "https://cdn-icons-png.flaticon.com/512/17/17004.png"; // Coloque a URL da imagem ou genérica

//   return (
//     <div className="usuario-container">
//       <div className="perfil-bola">
//         <img src={imagemPerfil} alt="Perfil" />
//       </div>
//       <div className="lista-reclamacoes">
//         {reclamacoesExemplo.map((rec) => (
//           <div key={rec.id} className="cartao-reclamacao">
//             <h3>{rec.titulo}</h3>
//             <p>{rec.descricao}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Usuario;
