import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Subdomínio próprio (raiz). Para servir sob /admin no front, troque para '/admin/'.
  base: '/',
  server: { port: 5180 },
});
