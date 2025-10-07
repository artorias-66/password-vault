import "./globals.css";
import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";

export const metadata = {
  title: 'Password Vault',
  description: 'Secure password manager with encryption'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full border-b" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
          <HeaderClient />
        </header>
        {children}
      </body>
    </html>
  );
}