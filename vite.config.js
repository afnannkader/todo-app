import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path'; // Add resolve for path resolving
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'), // Add alias to resolve paths
        },
    },
});
