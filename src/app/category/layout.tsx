import Footer from "@/components/footer/Footer";

export default function categoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100 lg:bg-white">
      {children}
      <Footer />
    </div>
  );
}
