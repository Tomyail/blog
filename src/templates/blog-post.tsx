import { graphql } from 'gatsby';
import get from 'lodash/get';
import React from 'react';
import { Helmet } from 'react-helmet';
// import Bio from '../components/Bio';
import { Box } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import Divider from '../components/Divider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PostBody from '../components/PostBody';

const styles = {};

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteUrl = get(this.props, 'data.site.siteMetadata.siteUrl');

    const { previous, next } = this.props.pageContext;
    return (
      <Box>
        <Header />
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}>
          <html lang="zh-Hans" />
          <meta name="description" content="Tomyail的个人博客" />
        </Helmet>
        <PostBody
          post={post}
          previous={previous}
          next={next}
          siteUrl={siteUrl}
        />
        <Divider />
        <Footer />
      </Box>
    );
  }
}

export default withStyles(styles)(BlogPostTemplate);

export const query = graphql`
  query BlogPostBySlug($path: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      tableOfContents
      frontmatter {
        title
        tags
        created_at
        path
      }
    }
  }
`;
