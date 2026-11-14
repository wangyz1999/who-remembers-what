import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Where the site is served from. For a GitHub Pages project site this is "/<repo-name>/";
// the deploy workflow sets it from the repository name, so renaming the repo needs no edit here.
// Locally (dev / preview) it defaults to "/". For a user site or a custom domain, set BASE_PATH=/.
const BASE_PATH = process.env.BASE_PATH ?? '/';

// Absolute URL of the deployed page, used only for social-card meta tags (og:image, og:url).
// Also set by the workflow; empty locally, which leaves those tags relative.
const SITE_URL = process.env.SITE_URL ?? '';

function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
  };
}

export default defineConfig({
  base: BASE_PATH,
  plugins: [tailwindcss(), siteUrl()],
  build: {
    // Media files are already compressed; never inline them into JS/CSS.
    assetsInlineLimit: 0,
  },
});
