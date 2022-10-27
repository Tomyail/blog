import { readSync } from 'to-vfile';
import { unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { existsSync } from 'fs';
import { basename, extname, resolve, join, relative, dirname } from 'path';
import { format } from 'date-fns';

import fs from 'fs-extra';
const configUnified = () => {
  return unified().use(parse).use(stringify).use(frontmatter, ['yaml']);
};

const fromRoot = '/Users/lixuexin03/logseq-mobile';
const test = '/Users/lixuexin03/logseq-mobile/pages/PVE 安装和显卡直通设置.md';
const toRoot = '/Users/lixuexin03/source/personal/blog/src/pages/publish';

configUnified()
  .use(() => (tree, file) => {
    //创建日期可以根据选项决定(原始文件的时间,导入时间?)
    const title = basename(test, extname(test));
    const xx = `${format(new Date(), 'yyyy-MM-dd')}-${title}`;
    const floder = join(toRoot, xx);
    console.log(floder);
    fs.mkdirp(floder);
    file.data.destDir = floder;
  })
  .use(() => (tree, file) => {
    console.log(file.data);
    function visitor(node) {
      const originUrl = resolve(dirname(test), node.url);

      /* console.log(node, join(dirname(test), node.url)); */
      if (existsSync(originUrl)) {
        fs.copyFileSync(
          originUrl,
          join(file.data.destDir, basename(originUrl))
        );
        node.url = join('.', basename(node.url));
      } else {
        throw new Error(JSON.stringify(node) + ',image not exist' + originUrl);
      }
      // Sanitize URL by removing leading `/`
      // const relativeUrl = node.url.replace(/^\//, '');

      // node.url = new URL(relativeUrl, options.absolutePath).href;
    }
    visit(tree, 'image', visitor);
  })
  .process(readSync(test), (err, file) => {
    console.log(file, err);
  });
