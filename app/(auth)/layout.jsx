import { Inter } from "next/font/google";
import Navbar from "../components/navbar/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Earthie Fashion - Authentication",
    description: "Join Earthie today and become part of a thriving fashion community. Sign up now to discover the latest trends, access exclusive offers, and embark on an exciting fashion journey. Create your account and elevate your style with Earthie's curated collection of clothing and accessories.",
};

export default function AdminLayout({ children }) {
    return (
        // <html lang="en">
            // <body className={inter.className +' overflow-x-clip overflow-y-clip'}>
                <div className='overflow-x-clip overflow-y-clip'>
                    <Navbar/>                    
                    {children}
                </div>
            // </body>
        // </html>
    );
}
