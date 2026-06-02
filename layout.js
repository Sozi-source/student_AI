import "./globals.css";

export const metadata = {
  title: "KNDI Assistant — Imperial College",
  description:
    "AI-powered academic assistant for Human Nutrition & Dietetics students at Imperial College of Medical and Health Sciences. Get instant help with KNDI indexing, upgrading, and licensing queries.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Fraunces:wght@300;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a5c3a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
