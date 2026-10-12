import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles/globals.css';
import { SmoothScroll } from './components/animations/SmoothScroll.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </StrictMode>
);
