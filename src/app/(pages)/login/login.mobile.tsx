import React from "react";
import LoginForm from "./(components)/loginForm.mobile";

// Componente APENAS com a lógica e UI de mobile
const LoginMobile = () => {
  return (
    <div className="flex flex-col">
      <LoginForm />
    </div>
  );
};

export default LoginMobile;
