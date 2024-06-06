import { defineConfig } from 'vite';
import vue from "@vitejs/plugin-vue";
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false
                }
            }
        }),
        vuetify({autoImort: true}),
    ],
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm-bundler.js"
        }
    }
});
