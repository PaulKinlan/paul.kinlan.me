// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'static/share/image/main.mjs',
  output: {
    file: 'public/share/image/main.mjs',
    format: 'esm'
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**',
      namedExports: {
        'node_modules/@firebase/app/dist/index.cjs.js': ['initializeApp', 'firestore']
      }
    }),
    
    esbuild({
      minify: true
    })
  ]
};