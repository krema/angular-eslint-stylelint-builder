import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['lib/builder/src/index.ts'],
  tsconfig: 'tsconfig.lib.json',
  format: ['esm'],
  splitting: true,
  sourcemap: false,
  minify: false,
  clean: true,
  skipNodeModulesBundle: true,
  dts: true,
  outDir: 'out/dist',
  copy: [
    { from: 'LICENSE', to: 'out/LICENSE' },
    { from: 'README.md', to: 'out/README.md' },
    { from: 'lib/builder/builders.json', to: 'out/builders.json' },
    { from: 'lib/builder/package.json', to: 'out/package.json' },
    { from: 'lib/builder/src/schema.json', to: 'out/dist/schema.json' },
    { from: 'lib/builder/src/schema.d.ts', to: 'out/dist/schema.d.ts' },
  ],
  unbundle: true
});
