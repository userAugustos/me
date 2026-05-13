import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // base: process.env.BASE_PATH ?? '/',
  plugins: [tailwindcss()],
});
