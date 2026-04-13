import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "NetClassix",
  description: "Modern LMS untuk SMK TJKT: networking, cybersecurity, dan system administration."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${headingFont.variable} ${monoFont.variable} font-sans antialiased [font-family:var(--font-heading)]`}
      >
        {children}
      </body>
    </html>
  );
}
