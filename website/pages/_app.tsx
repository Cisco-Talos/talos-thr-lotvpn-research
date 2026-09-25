import '../styles/globals.css'
import { EuiProvider } from '@elastic/eui'
import type { AppProps } from 'next/app'
import type { ReactNode } from 'react'
import type { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)
  return (
    <EuiProvider colorMode="dark">
      {getLayout(<Component {...pageProps} />)}
    </EuiProvider>
  )
}

