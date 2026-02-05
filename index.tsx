
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("🚀 Jaguar Arena: Iniciando motor gráfico...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Notifica o index.html que o processo foi concluído com sucesso
    (window as any).JaguarReady = true;
    window.dispatchEvent(new Event('JaguarMounted'));
    console.log("✅ Jaguar Arena: Sistema carregado com sucesso.");
  } catch (error) {
    console.error("❌ Jaguar Arena: Erro fatal durante a montagem:", error);
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) errorMsg.innerText = "Falha interna no React: " + String(error);
  }
}
