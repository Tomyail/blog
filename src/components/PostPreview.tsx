import { Chip, Box, CardHeader, Typography, useTheme } from '@material-ui/core';
// import { Link } from 'reach';
import Link from 'gatsby-link';
import get from 'lodash/get';
import React from 'react';

const SubHeader = ({ created_at, time, tags }) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignContent="center"
      alignItems="center"
      sx={{
        '& .div': {
          margin: '1px',
        },
      }}
    >
      <Box display="flex">
        <Box>{new Date(created_at).toLocaleDateString()}</Box>
        <Box>{`${time} min read`}</Box>
      </Box>
      {tags.map((tag) => {
        return <Chip variant="outlined" label={tag} size="small"></Chip>;
      })}
    </Box>
  );
};
const PostPreview = ({ node }) => {
  const {
    frontmatter: { tags = [] },
  } = node;

  const title = get(node, 'frontmatter.title') || node.fields.slug;
  const slug = get(node, 'frontmatter.path');
  const theme = useTheme();
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
        subheader={
          <SubHeader
            created_at={node.frontmatter.created_at}
            time={node.timeToRead}
            tags={tags}
          />
        }
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
