import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TajulTonim - Personal Blog</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://" + process.env.SITE_URL} />
        <meta property="og:image" content="https://tonim.ml/favicon.ico" />
        <meta property="og:site_name" content="TajulTonim Blog" />
        <meta name="twitter:site" content="@tajultonim" />
        <meta name="twitter:title" content="TajulTonim Blog" />
        <meta
          name="twitter:description"
          content="Hey, it's Tonim. It's my personal blog. I share educational stuff here."
        />
        <meta name="twitter:image:src" content="https://tonim.ml/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content="Hey, it's Tonim. It's my personal blog. I share educational stuff here."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
