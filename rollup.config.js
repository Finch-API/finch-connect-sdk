const { nodeResolve } = require('@rollup/plugin-node-resolve');
const swc = require('@rollup/plugin-swc');
const replace = require('@rollup/plugin-replace');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

const packageJson = require('./package.json');

module.exports = [
  // UMD build for vanilla JS (browser globals)
  {
    input: 'src/umd.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'FinchConnect',
      exports: 'default',
      globals: {
        react: 'React',
      },
    },
    plugins: [
      peerDepsExternal(),
      nodeResolve({ extensions: ['.ts', '.js'] }),
      swc({ swc: { jsc: { target: 'es2018' } } }),
      replace({
        preventAssignment: true,
        SDK_VERSION: `unified-${packageJson.version}`,
      }),
    ],
  },
  // ES modules build (both APIs)
  {
    input: 'src/index-with-react.ts',
    output: {
      file: 'dist/index.es.js',
      format: 'esm',
    },
    external: ['react'],
    plugins: [
      peerDepsExternal(),
      nodeResolve({ extensions: ['.ts', '.js'] }),
      swc({ swc: { jsc: { target: 'es2018' } } }),
      replace({
        preventAssignment: true,
        SDK_VERSION: `unified-${packageJson.version}`,
      }),
    ],
  },
  // React-specific ES modules build
  {
    input: 'src/react.ts',
    output: {
      file: 'dist/react.es.js',
      format: 'esm',
    },
    external: ['react'],
    plugins: [
      peerDepsExternal(),
      nodeResolve({ extensions: ['.ts', '.js'] }),
      swc({ swc: { jsc: { target: 'es2018' } } }),
      replace({
        preventAssignment: true,
        SDK_VERSION: `unified-${packageJson.version}`,
      }),
    ],
  },
];
