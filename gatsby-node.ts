import _ from 'lodash';
import path from 'path';
import type { GatsbyNode } from 'gatsby';

const renderVisiblePost = (posts, createPage) => {
  const postsPerPage = 9;
  const numberPages = Math.ceil(posts.length / postsPerPage);
  const blogPost = path.resolve('./src/templates/blog-post.tsx');
  Array.from({ length: numberPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/pages/${i + 1}`,
      component: path.resolve('./src/templates/blog-page.tsx'),
      context: {
        preLink: i > 0 ? (i === 1 ? '/' : `/pages/${i}`) : null,
        nextLink: i < numberPages - 1 ? `/pages/${i + 1 + 1}` : null,
        limit: postsPerPage,
        skip: i * postsPerPage,
        numberPages,
        currentPage: i + 1,
      },
    });
  });

  posts.forEach((post, index) => {
    const next = index === posts.length - 1 ? false : posts[index + 1].node;
    const previous = index === 0 ? false : posts[index - 1].node;

    createPage({
      path: post.node.frontmatter.path,
      component: blogPost,
      context: {
        index,
        previous,
        next,
      },
    });
  });
};

export const createPages: GatsbyNode['createPages'] = ({
  graphql,
  actions,
}) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              limit: 1000
              filter: { frontmatter: { visible: { ne: false } } }
              sort: { frontmatter: { created_at: DESC } }
            ) {
              totalCount
              edges {
                node {
                  frontmatter {
                    title
                    path
                    tags
                  }
                }
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }
        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;
        renderVisiblePost(posts, createPage);
      })
    );
  });
};
export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = node.frontmatter.path + '/'; //createFilePath({ node, getNode });
    //gatsby-remark-toc 插件需要使用 slug 作为路径,所以开启 onCreateNode 函数
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
