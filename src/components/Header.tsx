import { createTheme, Hidden, IconButton, adaptV4Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import { useTheme } from '../../plugins/custom-mui-theme';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
const Header = ({ showDrawerSwitch, onSwitchClick }) => {
  const { setTheme, theme } = useTheme();
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);
  const Bar = (
    <AppBar
      color={theme.palette.mode === 'dark' ? 'default' : 'primary'}
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            '& a': {
              color: 'white',
              textDecoration: 'inherit',
            },
            '& a:hover': {
              textDecoration: 'inherit',
            },
          }}
        >
          <Link to={'/'}>{data.site.siteMetadata.title}</Link>
        </Typography>
        {showDrawerSwitch && (
          <Hidden mdUp>
            <IconButton
              aria-label="sidebar"
              sx={{ color: 'white' }}
              onClick={() => {
                onSwitchClick && onSwitchClick();
              }}
              size="large"
            >
              <DehazeOutlinedIcon />
            </IconButton>
          </Hidden>
        )}
        <IconButton
          aria-label="switch theme"
          sx={{ color: 'white' }}
          onClick={() => {
            const newTheme = createTheme(
              adaptV4Theme({
                palette: {
                  primary: {
                    main: theme.palette.primary.main,
                  },
                  secondary: {
                    main: theme.palette.secondary.main,
                  },
                  mode:
                    (theme as Theme).palette.mode === 'dark' ? 'light' : 'dark',
                },
              })
            );
            setTheme(newTheme);
          }}
          size="large"
        >
          {(theme as Theme).palette.mode === 'dark' ? (
            <Brightness7RoundedIcon /> //light
          ) : (
            <Brightness4Icon /> //moon
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
  return (
    <React.Fragment>
      {Bar}
      <Toolbar id="back-to-top-anchor" />
    </React.Fragment>
  );
};

export default Header;
