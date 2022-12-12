import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import ProtectedLayout from "./protected";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {  
  return (
    <SessionProvider session={session}>
      <ProtectedLayout>
        <Component {...pageProps} />
      </ProtectedLayout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
