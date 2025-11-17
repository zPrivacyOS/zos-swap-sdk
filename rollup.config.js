const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: false,
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: ['axios'],
  },
];
