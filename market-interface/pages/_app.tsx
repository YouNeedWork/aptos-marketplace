import type { AppProps } from 'next/app';
//import { SuietWallet, SuiWallet, WalletProvider } from '@suiet/wallet-kit';
import 'antd/dist/antd.css';
import '../styles/globals.css'

import Header from '../components/Header/header';
import Footer from '../components/Footer/footer';

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
    <WalletProvider
      wallets={wallets}
      autoConnect={true}
      onError={(error: Error) => {
        console.log('Handle Error Message', error);
      }}>
      <div data-theme="cmyk">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </WalletProvider>
  );
}
