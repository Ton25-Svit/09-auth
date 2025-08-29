import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "variable",
  display: "auto"
})

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Welcome to NoteHub, a simple and effective application designed to manage personal notes",
  openGraph: {
    title: "NoteHub",
    description: "Welcome to NoteHub, a simple and effective application designed to manage personal notes",
    url: "https://09-auth-ashen.vercel.app/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub logo"
      },
    ],
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fontRoboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header/>
            {children}
            {modal}
            <Footer/>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
