// vite.config.js — MediCare+ Hospital Management System
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  plugins: [
    {
      name: 'copy-scripts-and-styles',
      writeBundle() {
        const fs = require('fs');
        const path = require('path');

        const copyDir = (src, dest) => {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          for (const file of fs.readdirSync(src)) {
            const srcFile  = path.join(src, file);
            const destFile = path.join(dest, file);
            if (fs.statSync(srcFile).isDirectory()) {
              copyDir(srcFile, destFile);
            } else {
              fs.copyFileSync(srcFile, destFile);
            }
          }
        };

        // Copy scripts and styles to dist
        copyDir('scripts', 'dist/scripts');
        copyDir('styles',  'dist/styles');

        // Also keep backward-compat copies in js/ and css/ inside dist
        if (fs.existsSync('js')) copyDir('js', 'dist/js');
        if (fs.existsSync('css')) copyDir('css', 'dist/css');

        console.log('[MediCare+] Scripts & Styles copied to dist/');
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
});
