import { useState, useEffect } from 'react';

/**
 * Hook customizado para detectar se a tela é mobile, de forma segura
 * para hidratação no Next.js.
 *
 * @returns {boolean | null} `true` se for mobile, `false` se for desktop,
 * `null` durante SSR ou na montagem inicial do cliente.
 */
export const useIsMobile = (): boolean | null => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Define o valor no "mount" do lado do cliente
    checkDevice();

    // Adiciona o listener para redimensionamento
    window.addEventListener('resize', checkDevice);

    // Limpa o listener ao desmontar
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};