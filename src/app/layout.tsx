import type { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "../styles/globals.scss";
import "../styles/different.scss";

const InterFont = Inter({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Gym tracker",
  description: "Helper for your workout",
};

export const viewport: Viewport = {
  userScalable: false,
  maximumScale: 1,
  initialScale: 1,
}

interface RootLayoutType {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutType) {
  return (
    <html lang="en">
    <body className={`${InterFont.className}`}>
    <main>{children}</main>
    </body>
    </html>
  );
}
