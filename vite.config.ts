import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Permet d'utiliser des chemins relatifs pour l'hébergement GitHub Pages sans se soucier du sous-dossier
})
