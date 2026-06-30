import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Subdomínio próprio (raiz). Para servir sob /admin no front, troque para '/admin/'.
  base: '/',
  server: {
    port: 5180,
    // Proxy local: o navegador fala só com o localhost, o Vite repassa pro backend
    // (evita bloqueio de CORS ao testar localmente).
    proxy: {
      '/api': {
        target: 'https://apps-sharp-ai-backend.jyo3rb.easypanel.host',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
