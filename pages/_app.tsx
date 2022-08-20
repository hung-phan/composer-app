import { AppProps } from "next/app";
import Head from "next/head";
import { FC, StrictMode } from "react";

import { ErrorBoundary } from "../share/elements/staticComponents";
import { wrapper } from "../share/store";

if (process.env.ENVIRONMENT === "client") {
  require("./../styles/globals.css");
}


const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>My new cool app</title>
    </Head>
    <ErrorBoundary>
      <StrictMode>
        <Component {...pageProps} />
      </StrictMode>
    </ErrorBoundary>
  </>
);

export default wrapper.withRedux(MyApp);
