import { readSync } from 'to-vfile';
import { unified } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { basename, extname, resolve, join, relative, dirname } from 'path';
import { format } from 'date-fns';
import yaml from 'js-yaml';
import fs from 'fs-extra';
import debug from 'debug';

const logger = debug('importFromLogseq');
const configUnified = () => {
  return unified().use(parse).use(stringify).use(frontmatter, ['yaml']);
};

const fromRoot = '/Users/lixuexin03/logseq-mobile';
const test = '/Users/lixuexin03/logseq-mobile/pages/homelab 主机改造.md';
const toRoot = '/Users/lixuexin03/source/personal/blog/src/pages/publish';

configUnified()
  .use(() => (tree, file) => {
    //创建日期可以根据选项决定(原始文件的时间,导入时间?)
    const title = basename(test, extname(test));
    const xx = `${format(new Date(), 'yyyy-MM-dd')}-${title}`;
    const floder = join(toRoot, xx);
    logger(`dest dir ${floder}`);
    fs.mkdirp(floder);
    file.data.title = title;
    file.data.destDir = floder;
  })
  .use(() => (tree, file) => {
    function changeImgUrl(node) {
      const originUrl = resolve(dirname(test), node.url);
      if (fs.existsSync(originUrl)) {
        fs.copyFileSync(
          originUrl,
          join(file.data.destDir, basename(originUrl))
        );
        node.url = join('.', basename(node.url));
      } else {
        throw new Error(JSON.stringify(node) + ',image not exist' + originUrl);
      }
    }
    visit(tree, 'image', changeImgUrl);

    let idx = 0;
    visit(tree, 'paragraph', (node) => {
      // only first will be frontmatter
      if (idx === 0) {
        visit(node, 'text', (text) => {
          const props = text.value.split('\n').reduce((acc, prop) => {
            let [name, value] = prop.split(':: ');
            logger(`found logseq property ${name}:${value}`);
            if (name === 'tags') {
              value = value.split(' ').map((str) => str.replace('#', ''));
            }
            acc[name] = value;
            return acc;
          }, {});
          if (Object.keys(props).length) {
            text.value = '';
          }
          file.data.props = props;
        });
        idx++;
      }
    });

    idx = 0;
    // remove logseq  topmost list
    visit(tree, 'list', (node) => {
      if (idx === 0) {
        const flattenPrag = node.children
          .map((listItem) => {
            return listItem.children;
          })
          .filter((res) => res.length)
          .flat(999);
        tree.children.pop();
        tree.children.push(...flattenPrag);
        idx++;
      }
    });
  })
  // update fromtmatter
  .use(() => (tree, file) => {
    const frontmatter = {
      title: file.data.title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      path: '/' + file.data.title,
      tags: file.data.props.tags,
    };

    tree.children.unshift({ type: 'yaml', value: yaml.dump(frontmatter) });
  })
  .process(readSync(test), (err, file) => {
    fs.writeFileSync(
      join(file.data.destDir, 'index.md'),
      file.toString('utf8')
    );
  });
