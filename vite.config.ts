import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Configure HMR for GitHub Codespaces forwarded ports
      // When accessed via Codespaces preview URL, HMR client connects to the forwarded domain
      hmr: process.env.DISABLE_HMR === 'true'
        ? false
        : process.env.CODESPACE_NAME
          ? {
              // Use WSS (WebSocket Secure) for Codespaces forwarded URLs
              protocol: 'wss',
              // Direct client to the Codespaces preview domain
              host: `${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`,
              // Omit port - Codespaces handles WSS on standard port 443
            }
          : true,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Enable CORS for Codespaces forwarded URLs
      cors: true,
    },
  };
});
