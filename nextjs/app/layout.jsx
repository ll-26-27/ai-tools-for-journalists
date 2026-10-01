import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "AI tools for journalists", template: "%s · AI tools for journalists" },
  description: "AI tools for journalists, from the Bok Center Learning Lab's AI Open Studio.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
