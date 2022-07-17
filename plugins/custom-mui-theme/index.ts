import { createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import constate from 'constate';
import React, { useEffect, useState } from 'react';

const useThemeHook = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(prefersDarkMode);
  const originTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          // primary: {
          //   main: '#1e88e5',
          // },
          secondary: {
            main: '#e91e63',
          },
        },
      }),
    [isDark]
  );

  const [theme, setTheme] = useState(originTheme);

  useEffect(() => {
    setTheme(originTheme);
  }, [originTheme]);

  return {
    theme,
    setIsDark,
    // setTheme,
  };
};

export const [CustomThemeProvider, useTheme] = constate(useThemeHook);
