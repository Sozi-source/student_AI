import "./globals.css";

export const metadata = {
  title: "HND Academic Assistant",
  description:
    "AI-powered academic assistant for Human Nutrition & Dietetics students at Imperial College of Medical and Health Sciences.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a5c3a" />
      </head>
      <body>{children}</body>
    </html>
  );
}