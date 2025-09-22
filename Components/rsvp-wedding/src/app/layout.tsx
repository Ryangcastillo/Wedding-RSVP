import type { Metadata } from "next";
import "./globals.css";

// Using system fonts instead of Google Fonts for build environment compatibility
const fontClasses = 'font-sans antialiased min-h-screen flex flex-col';

export const metadata: Metadata = {
  title: "Loren & Billy Wedding",
  description: "Join us for our special day. RSVP, view our story, and celebrate with us!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-neutral-900 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-serif text-lg font-bold mb-2 text-white">Loren & Billy</p>
            <p className="text-neutral-400">December 12, 2024</p>
            <p className="text-sm text-neutral-500 mt-4">
              Made with ❤️ for our special day
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
