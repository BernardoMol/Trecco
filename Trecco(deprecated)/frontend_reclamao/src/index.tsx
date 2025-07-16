// src/index.tsx (VERSÃO CORRETA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Importa seu componente App
import reportWebVitals from './reportWebVitals';

// NÃO IMPORTE BrowserRouter AQUI!
// import { BrowserRouter } from 'react-router-dom'; // REMOVA ESTA LINHA!

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App /> {/* Renderize apenas o App, que já contém o Router */}
  </React.StrictMode>
);

reportWebVitals();