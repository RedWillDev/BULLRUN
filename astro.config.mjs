// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import vue from '@astrojs/vue';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    host: true,
    allowedHosts: true
  },

  integrations: [vue()],
  
  adapter: node({
    mode: 'standalone'
  })
});