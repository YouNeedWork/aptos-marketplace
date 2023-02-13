import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeScript, ThemeConfig } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

import '../styles/globals.css'

import Header from '../components/Header/header'
import Footer from '../components/Footer/footer'


// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  bg: {
    primary: "#000",
    dark: "#fff",
  },
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}


// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}


const theme = extendTheme({ colors, config })


import {
  WalletProvider,
  HippoWalletAdapter,
  AptosWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter
} from '@manahippo/aptos-wallet-adapter';

const wallets = [
  new HippoWalletAdapter(),
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter()
];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={(error: Error) => {
          console.log('Handle Error Message', error);
        }}>

        <div>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </WalletProvider>
    </ChakraProvider>
  );
}
