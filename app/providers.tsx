// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { GoogleProvider } from '@/contexts/GoogleContext'
import theme from '@/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return <>
    <ChakraProvider theme={theme}>
      <GoogleProvider>
        {children}
      </GoogleProvider>
    </ChakraProvider>
  </>
}