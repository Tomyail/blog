import { CssBaseline } from '@mui/material';
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import React from 'react';
import { CustomThemeProvider, useTheme } from '.';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
const cache = createCache({
  key: 'css',
  prepend:false,
});

export const wrapRootElement = ({ element }) => {
  return (
    <CustomThemeProvider>
      <MaterialRoot>{element}</MaterialRoot>
    </CustomThemeProvider>
  );
};

const MaterialRoot = ({ children }) => {
  const { theme } = useTheme();
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme} key={'theme'}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
