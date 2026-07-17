import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // src/
            '@scss': path.resolve(__dirname, './src/scss'), //стили
            '@images': path.resolve(__dirname, './public/images'), //картинки
        },
    },
    build: {
        cssMinify: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
