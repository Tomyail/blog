const { mapMakrdowns } = require('./markdown-support');
const path = require('path');
const yaml = require('js-yaml');
const vfile = require('to-vfile');

import { mapMakrdowns } from './markdown-support';
import path from 'path';
import yaml from 'js-yaml';
import vfile from 'to-vfile';

const getImages= (file) =>
  file.children.filter((x) => x.type === 'image' );

mapMakrdowns({
  inputDir: path.join(__dirname, '..', 'astro/src/content/blog'),
  markdownMap: ({ path, file }) => {
    if (file.children[0].type !== 'yaml') {
      console.log('第一行不是yaml');
      return [false, file];
    }

    const frontmatter = yaml.load(file.children[0].value);
    const title = frontmatter.title;

    const nodes =getImages(file);

    if (nodes && nodes.length) {
      console.log(nodes)
      /* nodes.forEach((node) => { */
      /*   repaceLang(title, node, code); */
      /* }); */
      /**/
      /* return [true, file]; */
      return [false,file]
    }

    return [false, file];
  },
}).subscribe((x) => {
  vfile.writeSync(x.content);
});
