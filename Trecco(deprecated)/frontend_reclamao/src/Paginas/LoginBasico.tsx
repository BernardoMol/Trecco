import React from "react";
import { useNavigate } from "react-router-dom";

const LoginBasico: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aqui você pode adicionar validação futuramente
    navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
        <input
          type="text"
          placeholder="Login"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem" }}>
          <a href="#" style={{ color: "#2563eb", textDecoration: "underline" }}>
            Esqueceu sua senha?
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginBasico;