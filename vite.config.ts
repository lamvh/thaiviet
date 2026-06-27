import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base must match the GitHub Pages project path: https://lamvh.github.io/thaiviet/
export default defineConfig({ base: '/thaiviet/', plugins: [react()] });
