// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props: Record<string, any>) => ({
    body: {
      transitionProperty: "all",
      transitionDuration: "normal",
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#141214')(props),
    },
  }),
};
// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  disableTransitionOnChange: false
}

// 3. extend the theme
const theme = extendTheme({ config, styles })

export default theme