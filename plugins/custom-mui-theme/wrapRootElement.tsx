import { CssBaseline } from '@mui/material';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import React from 'react';
import { CustomThemeProvider, useTheme } from '.';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


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
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
