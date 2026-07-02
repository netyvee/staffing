import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    // Framework components ship TS source consumed via transpilePackages — their
    // utility classes must be scanned or the CSS gets purged (parity-critical).
    './node_modules/@vigil/web-framework/src/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;
