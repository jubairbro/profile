const esbuild = require('esbuild-wasm');
const fs = require('fs');

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

console.log("Starting build...");
esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'assets/bundle.js',
  format: 'esm',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  sourcemap: false,
}).then(() => {
  console.log('Build success! Output: assets/bundle.js');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});