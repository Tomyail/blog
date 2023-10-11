import { mapMakrdowns } from './markdown-support.js';
import path from 'path';
import yaml from 'js-yaml';
import { writeSync } from 'to-vfile';
import * as url from 'url';
import { visit } from 'unist-util-visit'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

mapMakrdowns({
  inputDir: path.join(__dirname, '..', 'astro/src/content/blog'),
  markdownMap: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return [false, file];
    }

    let hasFind = false
    visit(file, "image", node => {
      const isRemoteUrl = node.url.startsWith('http')
      const isRelativeUrl = node.url.startsWith('.')
      if (!(isRemoteUrl || isRelativeUrl)) {
        node.url = `./${node.url}`
        hasFind = true
      }
    })
    if (hasFind) {
      return [true, file]
    }

    return [false, file];
  },
}).subscribe((x) => {
  writeSync(x.content);
});
