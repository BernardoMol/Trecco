import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './paginas/login/Login';
import Registro from './paginas/registro/Registro';
import Recuperar_senha from './paginas/recuperar_senha/Recuperar_senha';
import PaginaUsuario from './paginas/perfil_usuario/PerfilUsuario';
import CriandoTarefa from './paginas/criando_tarefa/CriandoTarefa';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registro />} />
        <Route path="/recuperar_senha" element={<Recuperar_senha />} />
        <Route path="/usuario" element={<PaginaUsuario />} />
        <Route path="/criar_tarefa" element={<CriandoTarefa />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
