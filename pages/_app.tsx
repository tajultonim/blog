import "../styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import Head from "next/head";
import { Partytown } from "@builder.io/partytown/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TajulTonim - Personal Blog</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="TajulTonim Blog" />
        <meta property="fb:app_id" content="531198521796306" />
        <Partytown forward={["dataLayer.push"]} />
      </Head>
      <Component {...pageProps} />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        strategy="afterInteractive"
        type="text/partytown"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        type="text/partytown"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
}
