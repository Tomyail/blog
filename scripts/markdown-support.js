import unified from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';
import klaw from 'klaw-sync';
import path from 'path';
import { Observable, from } from 'rxjs';
import { filter, map, mergeAll, reduce } from 'rxjs/operators';

const configUnified = () => {
  return unified().use(parse).use(stringify).use(frontmatter, ['yaml']);
};

const filterMarkdown = (path, filter) => {
  return new Observable((sub) => {
    configUnified()
      .use(() => (file, state, done) => {
        sub.next({ file, result: filter({ file, state, path }), path });
        return done();
      })
      .process(vfile.readSync(path), function (err, file) {
        sub.complete();
      });
  });
};

const mapMakrdown = (path, map) => {
  return new Observable((sub) => {
    configUnified()
      .use(() => (file, state, done) => {
        const newFile = map({ file, state, path });
        sub.next({ result: newFile, path });
        return done(null, newFile[1], state);
      })
      .process(vfile.readSync(path), function (err, file) {
        sub.next({ file });
        sub.complete();
      });
  });
};

const readMarkdowns = (dir) => {
  const markdowns = klaw(dir, {
    traverseAll: true,
    filter: (item) => {
      const ext = path.extname(item.path);
      if (ext === '.md') {
        return true;
      }
      return false;
    },
  });
  // console.log(markdowns.map(m=>m.path))
  return markdowns;
};

export const filterMarkdowns = ({ inputDir, markdownFilter }) => {
  const markdowns = readMarkdowns(inputDir);
  return from(
    markdowns.map(({ path }) => filterMarkdown(path, markdownFilter))
  ).pipe(
    mergeAll(),
    filter((x) => x.result),
    map((x) => ({ path: x.path, file: x.file }))
  );
};
export const mapMakrdowns = ({ inputDir, markdownMap }) => {
  const markdowns = readMarkdowns(inputDir);
  return from(
    markdowns.map(({ path }) =>
      mapMakrdown(path, markdownMap).pipe(
        reduce((acc, cur) => {
          return { ...acc, ...cur };
        }, {})
      )
    )
  ).pipe(
    mergeAll(),
    filter((x) => x.result && x.result[0]),
    map((x) => ({ path: x.path, file: x.result[1], content: x.file }))
  );
};
