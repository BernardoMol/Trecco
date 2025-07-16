// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes de página
import Login from './Paginas/Login';       // Verifique o caminho real para Login.tsx
import Usuario from './Paginas/Usuario';   // Verifique o caminho real para Usuario.tsx
import Registrar from './Paginas/Registrar'; // Se você tiver uma página de registro

// IMPORTANTE: Importe o AuthProvider que você acabou de criar
import { AuthProvider } from './Contexts/AuthContext'; // <--- Nova linha! Verifique o caminho.
import NovaReclamacao from './Paginas/NovaReclamacao';

function App() {
  return (
    <Router>
      {/* Envolva TODAS as suas rotas com o AuthProvider.
        Isso garante que qualquer componente dentro dessas rotas 
        (como Login, Usuario, etc.) possa acessar o contexto de autenticação.
      */}
      <AuthProvider> 
        <Routes>
          {/* Suas rotas aqui */}
          <Route path="/" element={<Login />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/nova-reclamacao" element={<NovaReclamacao />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;