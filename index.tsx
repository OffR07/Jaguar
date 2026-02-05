
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("🐆 Jaguar: Arena carregando...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Indica para o index.html que o carregamento terminou
    (window as any).JaguarReady = true;
    window.dispatchEvent(new Event('JaguarMounted'));
    console.log("🐆 Jaguar: Arena pronta!");
  } catch (error) {
    console.error("Erro no React:", error);
    const debug = document.getElementById('debug-info');
    if (debug) debug.innerText += "\n[REACT ERROR]: " + String(error);
  }
}
