
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Notifica o index.html que o React foi montado com sucesso
    (window as any).JaguarReady = true;
    window.dispatchEvent(new Event('JaguarMounted'));
  } catch (error) {
    console.error("React Mounting Error:", error);
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) errorMsg.innerText = String(error);
  }
}
