import { Box, CardHeader, Typography, useTheme } from '@mui/material';
// import { Link } from 'reach';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React from 'react';

const PostPreview = ({ node }) => {
  const {
    frontmatter: {  tags = [] },
  } = node;
  if (!tags) {
  }
  const title = get(node, 'frontmatter.title') || node.fields.slug;
  const slug = get(node, 'frontmatter.path');
  const theme = useTheme();
	console.log('theme', theme);
  return (
    <Box>
      <CardHeader
        sx={{ paddingLeft: 0 }}
        title={
          <Link
            to={slug}
            style={{
              textDecoration: 'inherit',
              color: theme.palette.primary.main,
            }}
          >
            <div>{title}</div>
          </Link>
        }
        subheader={`${new Date(node.frontmatter.created_at).toLocaleDateString()} | ${node.timeToRead} min read`}
      />
      <Box>
        <Typography paragraph variant="body1">
          {node.excerpt}
        </Typography>
        <Typography variant="caption" gutterBottom />
      </Box>
    </Box>
  );
};

export default PostPreview;
