import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";
import { SignerProvider } from "../state/nft-market/signer";
import "../styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL as string;
const apolloClient = new ApolloClient({cache: new InMemoryCache(), uri: GRAPH_URL})

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SignerProvider>
      <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </ApolloProvider>
    </SignerProvider>
  );
};

export default MyApp;
