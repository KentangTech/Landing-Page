import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import AOSInit from "./components/AOSInit";
import './globals.css';

export const metadata = {
  title: "PT Graha Sarana Gresik",
  icons: {
    icon: "/image/GSG-Logo-Aja.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/GSG-Logo-Aja.png" type="image/png" />
      </head>
      <body>
        <AOSInit />
        {children}
      </body>
    </html>
  );
}
