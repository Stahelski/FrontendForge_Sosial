// Denne filen definerer NextAuth (innlogging) som en API-rute i Next.js App Router.
// Sti-konvensjonen [..nextauth] gjør at NextAuth selv håndterer alle auth-URLer (signin, callback, osv.)
// Eksporter av GET/POST på slutten gjør at Next.js serveren ruter HTTP-kall til denne handleren.

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Deler én PrismaClient-instans i hele appen (unngår for mange tilkoblinger)
import { callbackify } from "util";

/*
  authOptions er "oppskriften" NextAuth følger:
  - hvilke innloggings-metoder (providers)
  - hvordan sesjonen lagres (JWT eller database)
  - hvilke callback-funksjoner som kan tilpasse token og session
  - hvilke egne sider som skal brukes (login-side)
*/

export const authOptions = {
  session: { strategy: "jwt" }, // "jwt" betyr at innloggings-info holdes i et signert token (ikke i databasen).
  pages: { signIn: "/login" }, // Når NextAuth trenger en sign-in-side, send brukeren til vår egen /login-side
  providers: [
    // Providers: vi bruker "Credentials" = e-post + passord som vi validerer mot databasen
    CredentialsProvider({
      name: "Email og passord", // Vises i UI (om du bruker NextAuth sine standard-sider)
      credentials: {
        // Beskriver inputfeltene som NextAuth forventer
        email: { label: "E-post", type: "email" },
        password: { kabel: "Password", type: "password" },
      },

      /*
        authorize() kjøres når brukeren sender inn e-post og passord.
        Her bestemmer DU om brukeren skal få logge inn:
        - Finn bruker i DB
        - Sjekk at passordet stemmer (bcrypt.compare mot lagret hash)
        - Returner et "user"-objekt hvis OK, returner null hvis feil
      */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null; // Enkle "guard"-sjekker: hvis noe mangler, nekt innlogging

        const user = await prisma.user.findUnique({
          // Slår opp bruker på e-post. (Sørg for at prisma User-modellen har feltet passwordHash)
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null; // Hvis vi ikke fant bruker, eller brukeren mangler lagret passord-hash, nekt

        const ok = await bcrypt.compare(
          // Sammenlign plaintext passord fra skjema med hash fra databasen
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;

        return {
          // Returner et "smått" bruker-objekt. Ikke legg ved sensitiv info her.
          id: user.id,
          name: user.displayName ?? user.username, // Hva som skal vises som "navn" i session
          email: user.email,
        };
      },
    }),
  ],

  /*
    callbacks lar deg justere innhold i JWT og session.
    - jwt: Kalles når token lages/oppdateres. Vi kan f.eks. legge inn userId i token.
    - session: Kalles når session-objektet lages av token. Vi kan f.eks. legge userId inn i session.user.
  */

  callbacks: {
    async jwt({ token, user }) {
      // Når authorize() returnerer en bruker ved innlogging, legges den her i "user".
      // Vi tar vare på user.id i token, så vi har den tilgjengelig senere.
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (!session.user) session.user = {}; // Sørg for at session.user finnes før vi setter felt
      if (token?.userId) session.user.id = token.userId; // Legg userId fra token inn i session slik at serverkomponenter kan lese den
      return session;
    },
  },
};

/*
  NextAuth returnerer en request-handler.
  I App Router må vi eksportere den både som GET og POST for at NextAuth skal fungere riktig.
*/
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
