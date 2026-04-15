import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import UserHeader from "@/components/UserHeader";
import { auth } from "../../auth";

export const metadata: Metadata = {
  title: "SSAT Vocab Tool",
  description: "Vocabulary flashcards for SSAT test prep",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <Providers session={session}>
          <UserHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
