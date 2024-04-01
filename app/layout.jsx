import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import Providers from "@/redux/Providers";
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Earthie Fashion",
  description: "Discover the latest trends and elevate your style with Earthie. Explore our vibrant collection of fashion-forward clothing and accessories. Shop now for stylish looks that inspire confidence and creativity. Wear your identity",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body className={inter.className + ' overflow-x-clip'}>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
