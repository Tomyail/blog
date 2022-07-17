import { Box, Link as MLink, Avatar, experimentalStyled } from '@mui/material';
import React from 'react';
import '../assets/dracula-prism.css';

const MAvatar = experimentalStyled(Avatar)(({ theme }) => {
  return {
    width: theme.spacing(10),
    height: theme.spacing(10),
  };
});

const Profile = () => {
  return (
    <Box display="flex" alignItems="center" flexDirection="column" p={1}>
      <MAvatar>Super</MAvatar>
      <Box>来个签名？？</Box>
      <Box>
        <Box>
          <MLink
            href="https://twitter.com/tomyail"
            target="_blank"
            rel="noopener"
          >
            Twitter
          </MLink>
        </Box>
        <Box>
          <MLink
            href="https://github.com/Tomyail"
            target="_blank"
            rel="noopener"
          >
            Github
          </MLink>
        </Box>
        <Box>
          <MLink href="/atom.xml" target="_blank">
            Rss
          </MLink>
        </Box>
        <Box> 关于我</Box>
      </Box>
    </Box>
  );
};

export default Profile;
