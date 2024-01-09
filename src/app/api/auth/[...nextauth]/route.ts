import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {

        console.log({ credentials })

        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
});

export { handler as GET, handler as POST}
