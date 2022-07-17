import {
  Avatar,
  Box,
  Container,
  Drawer,
  experimentalStyled,
  Hidden,
  Pagination,
  PaginationItem,
  SwipeableDrawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../assets/dracula-prism.css';
import Divider from '../components/Divider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreview from '../components/PostPreview';
import SideBar from '../components/SideBar';

const Main = (props) => {
  const posts = get(props, 'data.allMarkdownRemark.edges');
  const currentPage = get(props, 'pageContext.currentPage');
  const numberPages = get(props, 'pageContext.numberPages');
  return (
    <Container maxWidth={'lg'} sx={{ flexGrow: 1 }}>
      {posts.map(({ node }) => (
        <PostPreview node={node} key={node.frontmatter.path} />
      ))}
      <Pagination
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        count={numberPages}
        page={currentPage}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`${item.page === 1 ? '/' : `/pages/${item.page}`}`}
            {...item}
          />
        )}
      />
      <Divider />
      <Footer />
    </Container>
  );
};
const BlogIndex = (props) => {
  const siteTitle = get(props, 'data.site.siteMetadata.title');

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const hiddenMdd = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const hiddenMdu = useMediaQuery((theme) => theme.breakpoints.up('md'));
  return (
    <>
      <Helmet title={siteTitle}>
        <html lang="zh-Hans" />
        <meta name="description" content="Helmet application" />
      </Helmet>
      <Header
        showDrawerSwitch
        onSwitchClick={() => {
          setOpen((o) => !o);
        }}
      />
      {!hiddenMdd && (
        <Box display="flex">
          <Main {...props} />
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{ width: 16 * 8, '& .MuiPaper-root': { width: 16 * 8 } }}
          >
            <Toolbar />
            <SideBar />
          </Drawer>
        </Box>
      )}
      {!hiddenMdu && (
        <>
          <Main {...props} />
          <SwipeableDrawer
            sx={{ width: 16 * 8, '& .MuiPaper-root': { width: 16 * 8 } }}
            onClose={(event) => {
              setOpen(false);
            }}
            onOpen={() => {
              setOpen(true);
            }}
            open={open}
            variant="temporary"
            anchor="right"
          >
            <Toolbar />
            <SideBar />
          </SwipeableDrawer>
        </>
      )}
    </>
  );
};

export default BlogIndex;
export const query = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { visible: { ne: false } } }
      sort: { fields: [frontmatter___created_at], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          timeToRead
          excerpt
          frontmatter {
            tags
            created_at
            title
            path
          }
        }
      }
    }
  }
`;
