import { styled, Theme, useTheme } from '@mui/material/styles';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Disqus from 'disqus-react';
import Link from 'gatsby-link';
import truncate from 'lodash/truncate';
import * as React from 'react';
import 'typeface-roboto';
import { Box, Button, Chip, Container, Fab, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { ScrollTop } from './ScrollTop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Divider from './Divider';

const Content = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  wordBreak: 'break-word',

  '& .anchor-link': {
    marginTop: -96, // Offset for the anchor.
    position: 'absolute',
  },

  '& pre': {
    position: 'relative',
    margin: theme.spacing(3, 'auto'),
    padding: theme.spacing(2),
    backgroundColor: '#272c34',
    direction: 'ltr',
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
    maxWidth: 'calc(100vw - 32px)',
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100vw - 32px - 16px)',
    },
  },

  //lang tag
  '& .gatsby-highlight': {
    position: 'relative',
  },

  '& div[data-language]:before': {
    fontWeight: 500,
    top: theme.spacing(-18 / 8),
    color: '#6272a4',
    right: theme.spacing(2),
    zIndex: 1,
    position: 'absolute',
    background: '#282a36',
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    padding: theme.spacing(0, 0.5),
    textAlign: 'center',
  },

  '& div[data-language="typescript"]:before': {
    content: '"ts"',
  },

  '& div[data-language="json"]:before': {
    content: '"json"',
  },
  '& div[data-language="sql"]:before': {
    content: '"sql"',
  },

  '& div[data-language="actionscript"]:before': {
    content: '"as"',
  },

  '& div[data-language="text"]:before': {
    content: '"text"',
  },

  '& div[data-language="csharp"]:before': {
    content: '"c#"',
  },

  '& div[data-language="bash"]:before': {
    content: '"bash"',
  },

  '& div[data-language="nginx"]:before': {
    content: '"nginx"',
  },

  '& div[data-language="yaml"]:before': {
    content: '"yaml"',
  },

  '& div[data-language="html"]:before': {
    content: '"html"',
  },

  '& div[data-language="javascript"]:before': {
    content: '"js"',
  },

  //end lang tag:w

  // // only  inline code
  '& :not(pre) > code[class*="language-"]': {
    direction: 'ltr',
    lineHeight: 1.4,
    display: 'inline-block',
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    WebkitFontSmoothing: 'subpixel-antialiased',
    padding: '0 3px',
    color: theme.palette.text.primary,
    background:
      theme.palette.mode === 'light'
        ? 'rgba(255, 229, 100, 0.2)'
        : 'rgba(255, 229, 100, 0.2)',
    fontSize: '.85em',
    borderRadius: 2,
  },
  // // code blocks
  // "& pre code": {
  //   background: "#272c34",
  //   fontSize: ".9em",
  // },
  '& .token.operator': {
    background: 'transparent',
  },
  '& h1': {
    ...theme.typography.h3,
    fontSize: 40,
    margin: '16px 0',
  },
  '& .description': {
    ...theme.typography.h5,
    margin: '0 0 40px',
  },
  '& h2': {
    ...theme.typography.h4,
    fontSize: 30,
    margin: '40px 0 16px',
  },
  '& h3': {
    ...theme.typography.h5,
    margin: '40px 0 16px',
  },
  '& h4': {
    ...theme.typography.h6,
    margin: '32px 0 16px',
  },
  '& h5': {
    ...theme.typography.subtitle2,
    margin: '32px 0 16px',
  },
  '& p, & ul, & ol': {
    marginTop: 0,
    marginBottom: 16,
  },
  '& ul': {
    paddingLeft: 30,
  },
  '& h1, & h2, & h3, & h4': {
    '& code': {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      // Remove scroll on small screens.
      wordBreak: 'break-all',
    },
    '& .anchor-link-style': {
      // To prevent the link to get the focus.
      display: 'none',
    },
    '& a:not(.anchor-link-style):hover': {
      color: 'currentColor',
      borderBottom: '1px solid currentColor',
      textDecoration: 'none',
    },
    '&:hover .anchor-link-style': {
      display: 'inline-block',
      padding: '0 8px',
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
      '& svg': {
        width: '0.7em',
        height: '0.7em',
        fill: 'currentColor',
      },
    },
  },
  '& table': {
    // Trade display table for scroll overflow
    display: 'block',
    wordBreak: 'normal',
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
    borderCollapse: 'collapse',
    marginBottom: '16px',
    borderSpacing: 0,
    overflow: 'hidden',
    '& .prop-name': {
      fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
    },
    '& .required': {
      color: theme.palette.mode === 'light' ? '#006500' : '#a5ffa5',
    },
    '& .prop-type': {
      fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
      color: theme.palette.mode === 'light' ? '#932981' : '#ffb6ec',
    },
    '& .prop-default': {
      fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
      borderBottom: `1px dotted ${theme.palette.divider}`,
    },
  },
  '& td': {
    ...theme.typography.body2,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: 16,
    color: theme.palette.text.primary,
  },
  '& td code': {
    lineHeight: 1.6,
  },
  '& th': {
    lineHeight: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    whiteSpace: 'pre',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: 16,
  },
  '& blockquote': {
    borderLeft: '5px solid #ffe564',
    backgroundColor: 'rgba(255,229,100,0.2)',
    padding: '4px 24px',
    margin: '24px 0',
    '& p': {
      marginTop: '16px',
    },
  },
  '& a, & a code': {
    // Style taken from the Link component
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& img, video': {
    maxWidth: '100%',
  },
  '& img': {
    // Avoid layout jump
    display: 'inline-block',
  },
  '& hr': {
    height: 1,
    margin: theme.spacing(6, 0),
    border: 'none',
    flexShrink: 0,
    backgroundColor: theme.palette.divider,
  },
  '& kbd.key': {
    // Style taken from GitHub
    padding: '4px 5px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    margin: '0 1px',
    font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
    lineHeight: '10px',
    color: theme.palette.text.primary,
    verticalAlign: 'middle',
    backgroundColor: '#fafbfc',
    border: '1px solid #d1d5da',
    borderRadius: 6,
    boxShadow: 'inset 0 -1px 0 #d1d5da',
  },
  '& em': {
    fontFamily: 'Sriracha',
    letterSpacing: '-0.25px',
    color: theme.palette.secondary.main,
    // fontStyle: ,
  },
  // '& h1': theme.typography.h3,
  // '& h2': theme.typography.h4,
  // '& h3': theme.typography.h5,
  // '& h4': theme.typography.h6,
  // '& h5': theme.typography.h6,
  // '& h6': theme.typography.h6,
  // '& a': {
  //   color: theme.palette.secondary.main,
  //   textDecoration: 'inherit'
  // },
  // '& a:hover': {
  //   textDecoration: 'underline'
  // }
}));

//https://github.com/mui-org/material-ui/blob/62883f7369a2a7dcb8b77a77b2c65a62c1615926/docs/src/modules/components/MarkdownElement.js#L6
const style = (theme: Theme) => {
  return {
    root: {
      marginTop: theme.spacing(1),
      display: 'relative',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    content: {
      ...theme.typography.body1,
      color: theme.palette.text.primary,
      wordBreak: 'break-word',

      '& .anchor-link': {
        marginTop: -96, // Offset for the anchor.
        position: 'absolute',
      },

      '& pre': {
        position: 'relative',
        margin: theme.spacing(3, 'auto'),
        padding: theme.spacing(2),
        backgroundColor: '#272c34',
        direction: 'ltr',
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
        maxWidth: 'calc(100vw - 32px)',
        [theme.breakpoints.up('md')]: {
          maxWidth: 'calc(100vw - 32px - 16px)',
        },
      },

      //lang tag
      '& .gatsby-highlight': {
        position: 'relative',
      },

      '& div[data-language]:before': {
        fontWeight: 500,
        top: theme.spacing(-18 / 8),
        color: '#6272a4',
        right: theme.spacing(2),
        zIndex: 1,
        position: 'absolute',
        background: '#282a36',
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1),
        padding: theme.spacing(0, 0.5),
        textAlign: 'center',
      },

      '& div[data-language="typescript"]:before': {
        content: '"ts"',
      },

      '& div[data-language="json"]:before': {
        content: '"json"',
      },
      '& div[data-language="sql"]:before': {
        content: '"sql"',
      },

      '& div[data-language="actionscript"]:before': {
        content: '"as"',
      },

      '& div[data-language="text"]:before': {
        content: '"text"',
      },

      '& div[data-language="csharp"]:before': {
        content: '"c#"',
      },

      '& div[data-language="bash"]:before': {
        content: '"bash"',
      },

      '& div[data-language="nginx"]:before': {
        content: '"nginx"',
      },

      '& div[data-language="yaml"]:before': {
        content: '"yaml"',
      },

      '& div[data-language="html"]:before': {
        content: '"html"',
      },

      '& div[data-language="javascript"]:before': {
        content: '"js"',
      },

      //end lang tag:w

      // // only  inline code
      '& :not(pre) > code[class*="language-"]': {
        direction: 'ltr',
        lineHeight: 1.4,
        display: 'inline-block',
        fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
        WebkitFontSmoothing: 'subpixel-antialiased',
        padding: '0 3px',
        color: theme.palette.text.primary,
        background:
          theme.palette.mode === 'light'
            ? 'rgba(255, 229, 100, 0.2)'
            : 'rgba(255, 229, 100, 0.2)',
        fontSize: '.85em',
        borderRadius: 2,
      },
      // // code blocks
      // "& pre code": {
      //   background: "#272c34",
      //   fontSize: ".9em",
      // },
      '& .token.operator': {
        background: 'transparent',
      },
      '& h1': {
        ...theme.typography.h3,
        fontSize: 40,
        margin: '16px 0',
      },
      '& .description': {
        ...theme.typography.h5,
        margin: '0 0 40px',
      },
      '& h2': {
        ...theme.typography.h4,
        fontSize: 30,
        margin: '40px 0 16px',
      },
      '& h3': {
        ...theme.typography.h5,
        margin: '40px 0 16px',
      },
      '& h4': {
        ...theme.typography.h6,
        margin: '32px 0 16px',
      },
      '& h5': {
        ...theme.typography.subtitle2,
        margin: '32px 0 16px',
      },
      '& p, & ul, & ol': {
        marginTop: 0,
        marginBottom: 16,
      },
      '& ul': {
        paddingLeft: 30,
      },
      '& h1, & h2, & h3, & h4': {
        '& code': {
          fontSize: 'inherit',
          lineHeight: 'inherit',
          // Remove scroll on small screens.
          wordBreak: 'break-all',
        },
        '& .anchor-link-style': {
          // To prevent the link to get the focus.
          display: 'none',
        },
        '& a:not(.anchor-link-style):hover': {
          color: 'currentColor',
          borderBottom: '1px solid currentColor',
          textDecoration: 'none',
        },
        '&:hover .anchor-link-style': {
          display: 'inline-block',
          padding: '0 8px',
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.text.primary,
          },
          '& svg': {
            width: '0.7em',
            height: '0.7em',
            fill: 'currentColor',
          },
        },
      },
      '& table': {
        // Trade display table for scroll overflow
        display: 'block',
        wordBreak: 'normal',
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling.
        borderCollapse: 'collapse',
        marginBottom: '16px',
        borderSpacing: 0,
        overflow: 'hidden',
        '& .prop-name': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
        },
        '& .required': {
          color: theme.palette.mode === 'light' ? '#006500' : '#a5ffa5',
        },
        '& .prop-type': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          color: theme.palette.mode === 'light' ? '#932981' : '#ffb6ec',
        },
        '& .prop-default': {
          fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
          borderBottom: `1px dotted ${theme.palette.divider}`,
        },
      },
      '& td': {
        ...theme.typography.body2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 16,
        color: theme.palette.text.primary,
      },
      '& td code': {
        lineHeight: 1.6,
      },
      '& th': {
        lineHeight: theme.typography.pxToRem(24),
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.text.primary,
        whiteSpace: 'pre',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 16,
      },
      '& blockquote': {
        borderLeft: '5px solid #ffe564',
        backgroundColor: 'rgba(255,229,100,0.2)',
        padding: '4px 24px',
        margin: '24px 0',
        '& p': {
          marginTop: '16px',
        },
      },
      '& a, & a code': {
        // Style taken from the Link component
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      '& img, video': {
        maxWidth: '100%',
      },
      '& img': {
        // Avoid layout jump
        display: 'inline-block',
      },
      '& hr': {
        height: 1,
        margin: theme.spacing(6, 0),
        border: 'none',
        flexShrink: 0,
        backgroundColor: theme.palette.divider,
      },
      '& kbd.key': {
        // Style taken from GitHub
        padding: '4px 5px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        margin: '0 1px',
        font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        lineHeight: '10px',
        color: theme.palette.text.primary,
        verticalAlign: 'middle',
        backgroundColor: '#fafbfc',
        border: '1px solid #d1d5da',
        borderRadius: 6,
        boxShadow: 'inset 0 -1px 0 #d1d5da',
      },
      '& em': {
        fontFamily: 'Sriracha',
        letterSpacing: '-0.25px',
        color: theme.palette.secondary.main,
        // fontStyle: ,
      },
      // '& h1': theme.typography.h3,
      // '& h2': theme.typography.h4,
      // '& h3': theme.typography.h5,
      // '& h4': theme.typography.h6,
      // '& h5': theme.typography.h6,
      // '& h6': theme.typography.h6,
      // '& a': {
      //   color: theme.palette.secondary.main,
      //   textDecoration: 'inherit'
      // },
      // '& a:hover': {
      //   textDecoration: 'underline'
      // }
    },
  };
};

const PostBody = ({ post, previous, next, siteUrl }) => {
  const disqusShortname = 'tomyail';
  const disqusConfig = {
    url: `${siteUrl}${post.frontmatter.path.replace('/', '')}`,
    title: post.frontmatter.title,
  };
  const theme = useTheme();
  const {
    frontmatter: { tags = [] },
  } = post;
  return (
    <Container
      maxWidth={'md'}
      sx={{ marginTop: theme.spacing(1), display: 'relative' }}
    >
      <Box component="main">
        <Typography variant="h3" color={theme.palette.primary.main}>
          {post.frontmatter.title}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ margin: theme.spacing(1, 0) }}
        >
          <Box component="span">
            {new Date(post.frontmatter.created_at).toLocaleDateString()}
          </Box>
          {tags && (
            <Box component="span">
              {tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  variant="outlined"
                  sx={{ margin: theme.spacing(0, '4px') }}
                ></Chip>
              ))}
            </Box>
          )}
        </Box>
        <Content
          dangerouslySetInnerHTML={{
            __html: post.html,
          }}
          component="article"
        />

        <Divider />
        <Box
          display="flex"
          flexWrap="nowrap"
          justifyContent="space-between"
          padding={0}
        >
          {previous ? (
            <Link
              to={previous.frontmatter.path}
              style={{ textDecoration: 'inherit' }}
            >
              <Button>
                <ArrowBackIosOutlinedIcon
                  sx={{ marginRight: theme.spacing(1) }}
                />
                {truncate(previous.frontmatter.title)}
              </Button>
            </Link>
          ) : (
            <Button disabled>没有更多文章</Button>
          )}
          {next ? (
            <Link
              to={next.frontmatter.path}
              style={{ textDecoration: 'inherit' }}
            >
              <Button>
                {truncate(next.frontmatter.title)}
                <ArrowForwardIosOutlinedIcon
                  sx={{ marginRight: theme.spacing(1) }}
                />
              </Button>
            </Link>
          ) : (
            <Button disabled>没有更多文章</Button>
          )}
        </Box>
        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
          theme={theme?.palette?.mode ?? 'light'}
        />
      </Box>
    </Container>
  );
};

export default PostBody;
