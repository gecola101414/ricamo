import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign unhandled runtime errors from browser ResizeObserver notifications
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
