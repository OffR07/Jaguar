
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Sinaliza para o HTML que o React foi montado e o app está pronto
    (window as any).JaguarReady = true;
    window.dispatchEvent(new Event('JaguarMounted'));
  } catch (error) {
    console.error("Erro fatal ao montar aplicação Jaguar:", error);
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) errorMsg.innerText = String(error);
  }
}
