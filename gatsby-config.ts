import path from 'path';
process.env.GATSBY_GIT_COMMIT = process.env.VERCEL_GIT_COMMIT_SHA || '';
export default {
  siteMetadata: {
    title: 'Tomyail 的记忆现场',
    author: 'Tomyail',
    description: ' 一个程序员的自娱自乐',
    siteUrl: 'https://blog.tomyail.com',
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: `gatsby-plugin-lodash`,
      options: {
        disabledFeatures: [
          `shorthands`,
          `cloning`,
          'currying',
          'caching',
          'collections',
          'exotics',
          'guards',
          'metadata',
          'deburring',
          'unicode',
          'chaining',
          'memoizing',
          'coercions',
          'flattening',
          // 'paths',
          'placeholders',
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.join(__dirname, 'src', 'pages', 'publish'),
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              inlineCodeMarker: '›',
              //   showLineNumbers: true,
            },
          },

          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-JHCY0MVQ2W', // Google Analytics / GA
        ],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: [],
        },
      },
    },
    /* { */
    /*   resolve: `gatsby-plugin-google-analytics`, */
    /*   options: { */
    /*     trackingId: `UA-16492044-5`, */
    /*   }, */
    /* }, */
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
			{
			  site {
				siteMetadata {
				  title
				  description
				  siteUrl
				  site_url: siteUrl
				}
			  }
			}
		  `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
				{
				  allMarkdownRemark(
					limit: 1000,
					sort: { order: DESC, fields: [frontmatter___created_at] },
				  ) {
					edges {
					  node {
						excerpt
						html
						frontmatter {
						  title
						  created_at
						  path
						}
					  }
					}
				  }
				}
			  `,
            title: 'Tomyail 的记忆现场',
            output: '/atom.xml',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
    },
    // !!
    `custom-mui-theme`,
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tomyail's Blog`,
        short_name: `Tomyail's Blog`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `static/icons/icon-144x144.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: 'gatsby-plugin-typography',
    //   options: {
    //     pathToConfigModule: 'src/utils/typography'
    //   }
    // }
  ],
};
