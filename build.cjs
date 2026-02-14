const esbuild = require('esbuild-wasm');

async function build() {
  await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    platform: 'browser',
    target: ['es2020'],
    loader: { '.tsx': 'tsx', '.ts': 'ts' },
    define: { 'process.env.NODE_ENV': '"development"' },
    minify: false,
    sourcemap: true,
  });
  console.log('Build complete');
  process.exit(0);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});