
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
    
    (window as any).JaguarReady = true;
    window.dispatchEvent(new Event('JaguarMounted'));
  } catch (error) {
    console.error("Erro na montagem:", error);
    const debug = document.getElementById('debug-info');
    if (debug) debug.innerText = "Falha no React: " + String(error);
  }
}
