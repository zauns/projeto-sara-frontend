import React from "react";
import Image from "next/image";
import LoginFormDesktop from "./(components)/loginForm.desktop";

// Componente APENAS com a lógica e UI de desktop
const LoginDesktop = () => {
  return (
    <div className="min-h-screen w-full flex flex-row">
      {/* Lado Esquerdo - Imagem (60%) */}
      <div className="w-[60%] h-screen flex items-center justify-center bg-white relative">
        <Image
          src="/images/imagemLogin.png"
          alt="imagemLogin"
          fill
          className="object-contain p-8"
          priority
        />
      </div>

      {/* Lado Direito - Formulário (40%) */}
      <div className="w-[40%] h-screen overflow-y-auto">
        <LoginFormDesktop />
      </div>
    </div>
  );
};

export default LoginDesktop;
