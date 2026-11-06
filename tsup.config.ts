import { defineConfig } from 'tsup'

const entry = {
  index: 'src/index.ts',
  array: 'src/array/index.ts',
  object: 'src/object/index.ts',
  string: 'src/string/index.ts',
  number: 'src/number/index.ts',
  date: 'src/date/index.ts',
  function: 'src/function/index.ts',
  async: 'src/async/index.ts',
  browser: 'src/browser/index.ts',
  format: 'src/format/index.ts',
  validators: 'src/validators/index.ts',
  http: 'src/http/index.ts',
  react: 'src/react/index.ts'
}

export default defineConfig({
  entry,
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  target: 'es2022',
  esbuildOptions(options) {
    options.charset = 'utf8'
  }
})
