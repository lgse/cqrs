import { symlinkDir } from 'aria-build';
import * as fs from 'fs';

export default {
  plugins: [
    {
      async buildEnd() {
        await fs.promises.mkdir('dist', { recursive: true });
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pkg = require('./package.json');
        delete pkg.scripts;
        delete pkg.devDependencies;
        await Promise.all([
          fs.promises.writeFile(
            './dist/package.json',
            JSON.stringify(pkg, null, 2),
          ),
          fs.promises.copyFile('./README.md', './dist/README.md'),
        ]);
      },
      name: 'copy',
    },
    {
      buildEnd: () => symlinkDir('./dist', './node_modules/@lgse/cqrs'),
      name: 'link',
    },
  ],
};
