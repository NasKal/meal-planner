import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Το site σερβίρεται από https://naskal.github.io/meal-planner/
export default defineConfig({
  base: '/meal-planner/',
  plugins: [react()],
});
