import { ChainId, DAppProvider } from "@usedapp/core";
import { DefaultSeo } from "next-seo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "../src/styles/globals.scss";

const config = {
  readOnlyChain: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]:
      "https://eth-mainnet.alchemyapi.io/v2/tOFqeqwCfpkcg19ElpoKvQ5Z_W8u3F0p",
    [ChainId.Goerli]:
      "https://eth-goerli.g.alchemy.com/v2/AaeN94mTHZhPsVCjZ51MuUyx9QiQ-zvP",
  },
};

function MyApp({ Component, pageProps, router }) {
  const url = `https://valeriachampion.com${router.route}`;
  return (
    <>
      <DefaultSeo
        defaultTitle="Valeria Games"
        titleTemplate="%s | Valeria Games"
        description="Land before the War"
        openGraph={{
          type: "website",
          locale: "en_EN",
          url,
          site_name: "Valeria Games",
          title: "Valeria Games",
          description:
            "Land before the War",
          images: [
            {
              url: "https://pbs.twimg.com/profile_images/1551280111651094528/CITNkHk3_400x400.jpg",
            },
          ],
        }}
        twitter={{
          handle: "@ValeriaStudios",
          cardType: "summary_large_image",
        }}
      />
      <DAppProvider config={config}>
        <Component {...pageProps} />
        <ToastContainer
          theme="dark"
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
        />
      </DAppProvider>
    </>
  );
}

export default MyApp;
