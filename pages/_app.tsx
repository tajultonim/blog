import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TajulTonim - Personal Blog</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="TajulTonim Blog" />
        <meta property="fb:app_id" content="531198521796306" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
