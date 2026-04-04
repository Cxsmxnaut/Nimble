import "./globals.css";

export const metadata = {
  title: "Nimble",
  description: "Nimble learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
