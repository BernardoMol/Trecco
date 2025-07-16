// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Defina as interfaces para os dados (devem corresponder ao que seu backend envia)
// Se seu backend envia IdReclamacao, ConteudoReclamacao, DataCriacaoReclamacao
// essas interfaces devem refletir isso, mas em camelCase para o JavaScript/TypeScript.
interface Reclamacao {
  idReclamacao: number;
  conteudoReclamacao: string;
  dataCriacaoReclamacao: string; // Manter como string e converter ao exibir no frontend se necessário
  // Adicione outras propriedades da reclamação conforme seu DTO do backend
}

interface User {
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  imagemUsuario?: string; // Propriedade opcional
  // Adicione outras propriedades do usuário conforme seu DTO do backend
}

// Interface para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  reclamacoes: Reclamacao[] | null; // Adicione a lista de reclamações
  login: (token: string, userData: User, reclamacoesData: Reclamacao[]) => void;
  logout: () => void;
}

// Crie o Contexto (valor inicial undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crie o Provedor (Provider) para envolver sua aplicação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[] | null>(null); // Estado para as reclamações

  // Efeito para carregar token e dados do localStorage na inicialização do aplicativo
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    const storedReclamacoes = localStorage.getItem('userReclamacoes');

    if (storedToken && storedUserData) {
      setToken(storedToken);
      try {
        // Tenta parsear os dados do usuário e das reclamações
        setUser(JSON.parse(storedUserData));
        if (storedReclamacoes) {
          setReclamacoes(JSON.parse(storedReclamacoes));
        }
        setIsAuthenticated(true);
      } catch (e) {
        // Se houver erro no parse (dados corrompidos), limpa o localStorage
        console.error("Erro ao parsear dados do localStorage:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userReclamacoes');
      }
    }
  }, []); // O array vazio [] garante que este efeito roda apenas uma vez (na montagem do componente)

  // Função de login: armazena token, dados do usuário e reclamações
  const login = (newToken: string, userData: User, reclamacoesData: Reclamacao[]) => {
    setToken(newToken);
    setUser(userData);
    setReclamacoes(reclamacoesData); // Define as reclamações no estado
    setIsAuthenticated(true);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userReclamacoes', JSON.stringify(reclamacoesData)); // Armazena as reclamações no localStorage
  };

  // Função de logout: limpa tudo
  const logout = () => {
    setToken(null);
    setUser(null);
    setReclamacoes(null); // Limpa as reclamações do estado
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userReclamacoes'); // Remove as reclamações do localStorage
  };

  // O provedor disponibiliza os valores para os componentes filhos
  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, reclamacoes, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie o hook customizado 'useAuth' para facilitar o acesso ao contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Garante que o hook só seja usado dentro de um AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};