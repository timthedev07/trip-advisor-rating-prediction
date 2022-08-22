import "dragontail-experimental/dist/build.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DragontailProvider } from "dragontail-experimental";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DragontailProvider theme="dark">
      <Component {...pageProps} />
    </DragontailProvider>
  );
}

export default MyApp;
