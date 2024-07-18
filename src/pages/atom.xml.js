import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts
      .map((post) => ({
        ...post.data,
        link: `${post.slug}?utm_source=rss&utm_medium=rss&utm_campaign=rss`,
        pubDate: post.data.created_at,
      }))
      .filter(post=> import.meta.env.PROD ? post?.data?.draft !== true : true)
      .sort((a, b) => b.pubDate - a.pubDate),
  });
}
