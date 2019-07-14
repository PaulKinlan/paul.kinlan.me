// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'static/share/image/main.mjs',
  output: {
    file: 'dist/share/image/main.mjs',
    format: 'esm'
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**'
    }),
    
    terser()
  ]
};