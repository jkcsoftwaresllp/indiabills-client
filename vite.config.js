import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.REACT_APP_SERVER_URL': JSON.stringify(env.REACT_APP_SERVER_URL),
        },
        plugins: [react()],

        // THESE
        cacheDir: '.vite-cache',
        optimizeDeps: {
            force: true,
        },

        server: {
            port: 3000,
        },
    };
});
