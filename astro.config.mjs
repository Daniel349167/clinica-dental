// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';          // ✅ <-- antes: /serverless o /edge
import vue from '@astrojs/vue';

export default defineConfig({
  output: 'server',                             // ✅ <-- antes: 'hybrid' (inválido)
  adapter: vercel(),                            // ✅ <-- sin runtime; el adapter ya elige lo correcto en Vercel
  integrations: [vue()],
  devToolbar: { enabled: false },
});
