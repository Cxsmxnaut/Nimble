import "./globals.css";

export const metadata = {
  title: "Snaplet API",
  description: "Backend routes only",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
