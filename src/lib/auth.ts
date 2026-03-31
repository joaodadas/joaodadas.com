import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "~/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  events: {
    async signIn({ user, profile }) {
      if (profile?.login && user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { username: profile.login as string },
        });
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { username: true },
      });
      (session.user as { username?: string }).username =
        dbUser?.username ?? undefined;
      return session;
    },
  },
});
