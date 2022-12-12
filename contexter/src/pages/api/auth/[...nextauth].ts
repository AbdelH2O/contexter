import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email"
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  theme: {
    brandColor: "#e11d48",
    logo: "/contexter.png",
    colorScheme: "light",

  },
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    // {
    //   id: "auiOffice",
    //   name: "office365",
    //   type: "oauth",
    //   authorization: "https://login.microsoftonline.com/7025e04c-70ca-48bf-ab7b-73954cb846ad/",
    //   clientId : '139476e3-a7d7-47b3-96c5-83bb34ef287c',
    //   profile(profile) {
    //     console.log(profile);
    //     return {
    //       id: profile.id,
    //       // name: profile.kakao_account?.profile.nickname,
    //       // email: profile.kakao_account?.email,
    //       // image: profile.kakao_account?.profile.profile_image_url,
    //     }
    //   },
    // }
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    // AzureADB2CProvider({
    //   tenantId: env.AZURE_AD_B2C_TENANT_NAME,
    //   clientId: env.AZURE_AD_B2C_CLIENT_ID,
    //   clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
    //   primaryUserFlow: env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
    //   authorization: { params: { scope: "offline_access openid" } },
    // }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
