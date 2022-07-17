import constate from 'constate';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, adaptV4Theme } from '@mui/material';

const useThemeHook = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const originTheme = React.useMemo(
    () =>
      createTheme(adaptV4Theme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          // primary: {
          //   main: '#1e88e5',
          // },
          secondary: {
            main: '#e91e63',
          },
        },
      })),
    [prefersDarkMode]
  );

  const [theme, setTheme] = useState(originTheme);

  useEffect(() => {
    setTheme(originTheme);
  }, [originTheme]);

  return {
    theme,
    setTheme,
  };
};

export const [CustomThemeProvider, useTheme] = constate(useThemeHook);
