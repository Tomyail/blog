import fs from 'fs';
import path from 'path';
import { type CollectionEntry, getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const result = posts
    .map((post) => ({
      params: { slug: post.slug },
      props: post,
    }))
    .filter((x) => x.props.data.heroImage);
  return result;
}

export async function GET({ props }) {
  const imageFile = props.data.heroImage.src.replace('/@fs', '').split('?')[0];
  const imageBuffer = fs.readFileSync(imageFile);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
