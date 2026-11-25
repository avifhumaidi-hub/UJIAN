import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const LOGO_FILE = path.resolve(
  __dirname,
  'public/assets/aistudio/logo_nesaka-removebg-preview_ee9f6ab8.png'
);

export default defineConfig(() => {
  let embeddedLogoScript = '';
  if (fs.existsSync(LOGO_FILE)) {
    const b64 = fs.readFileSync(LOGO_FILE).toString('base64');
    embeddedLogoScript = `<script>window.__EMBEDDED_SCHOOL_LOGO__="data:image/png;base64,${b64}";</script>`;
  }

  return {
    base: './',
    publicDir: false,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-embedded-school-logo',
        transformIndexHtml(html) {
          if (!embeddedLogoScript) return html;
          return html.replace('</head>', `${embeddedLogoScript}</head>`);
        },
      },
      viteSingleFile(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist-singlefile',
      emptyOutDir: true,
      assetsInlineLimit: 100_000_000,
    },
  };
});
