import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/pipeback.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/pipeback.esm.js',
      format: 'es'
    },
    {
      file: 'dist/pipeback.umd.js',
      format: 'umd',
      name: 'Pipeback',
      exports: 'named'
    }
  ],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    })
  ]
};
