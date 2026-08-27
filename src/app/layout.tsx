
import type { Metadata } from "next";
import "./globals.css";
import { ProviderStore } from "@/redux/setup/Providerstore";
import HeaderWraper from "@/components/header/HeaderWraper";
export const metadata: Metadata = {
  title: "فروشگاه اینترنتی دیجی‌کالا",
  description: "فروشگاه اینترنتی با الهام از دیجی‌کالا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa" dir="rtl"
      className={`h-full antialiased`}
    >
      <body className="bg-gray-100 lg:bg-white h-full">
        <ProviderStore>
          <HeaderWraper />
          {children}
        </ProviderStore>
      </body>
    </html>
  );
}
