import { Inter } from "next/font/google";
import Navbar from "../components/navbar/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Earthie Fashion - Authentication",
    description: "Join Earthie today and become part of a thriving fashion community. Sign up now to discover the latest trends, access exclusive offers, and embark on an exciting fashion journey. Create your account and elevate your style with Earthie's curated collection of clothing and accessories.",
    keywords: ["earthie fashion", "fashion", "clothing", "oversized tshirt", "oversized tee", "oversized", "oversized tees", "streetwear", "streetwear clothing", "urban clothing", "hip hop clothing", "street style", "skate fashion",
        "graphic tees", "hoodies", "joggers", "sneakers", "caps", "limited edition clothing",
        "independent streetwear brands", "best graphic tees for men", "limited edition streetwear drops",
        "sustainable streetwear brands", "Fresh Threads", "Fresh Threads graphic tees", "limited edition streetwear",
        "Hypebeast", "techwear", "athleisure", "minimalist", "oversized streetwear"]
};

export default function AdminLayout({ children }) {
    return (
        // <html lang="en">
        // <body className={inter.className +' overflow-x-clip overflow-y-clip'}>
        <div className='overflow-x-clip overflow-y-clip'>
            <Navbar />
            {children}
        </div>
        // </body>
        // </html>
    );
}
