import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Servido sob /admin no domínio do front. Para subdomínio próprio, troque para '/'.
  base: '/admin/',
  server: { port: 5180 },
});
