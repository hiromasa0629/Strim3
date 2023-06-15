import "bootstrap/dist/css/bootstrap.min.css";
import "@rainbow-me/rainbowkit/styles.css";
import "styles/globals.css";
// import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import AppLayout from "../components/Layout";
import { useHuddle01 } from "@huddle01/react";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import MeetingMachineProvider from "../providers/MeetingMachineProvider";
import NFTStorageProvider from "../providers/NFTStorageProvider";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.ALCHEMY_SEPOLIA_API_KEY! }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Strim3",
  projectId: process.env.WALLETCONNECT_PROJECTID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { initialize, isInitialized } = useHuddle01();

  useEffect(() => {
    initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <NFTStorageProvider>
            <MeetingMachineProvider>
              {isInitialized ? (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              ) : (
                "Error"
              )}
            </MeetingMachineProvider>
          </NFTStorageProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
