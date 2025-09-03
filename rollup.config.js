const typescript = require('@rollup/plugin-typescript');
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
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/react.ts', 'src/setupTests.ts'],
      }),
      replace({
        preventAssignment: true,
        'SDK_VERSION': `unified-${packageJson.version}`,
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
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/setupTests.ts', 'src/umd.ts'],
      }),
      replace({
        preventAssignment: true,
        'SDK_VERSION': `unified-${packageJson.version}`,
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
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/index.ts'],
      }),
      replace({
        preventAssignment: true,
        'SDK_VERSION': `unified-${packageJson.version}`,
      }),
    ],
  },
];