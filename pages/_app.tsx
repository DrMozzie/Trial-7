import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";


// This is the chainId your dApp will work on.
const activeChainId = ChainId.Rinkeby;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>Trail 3</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="Valeria Games"
          content="Land before the War"
        />
        <meta
          name="Valeria Games"
          content="Land before the War"
        />
      </Head>
      <Component {...pageProps} /> 
    </ThirdwebProvider>
  );
}

export default MyApp;
