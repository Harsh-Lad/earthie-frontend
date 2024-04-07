'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import success from '@/public/success.webp'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

function OrderSuccess() {
    const [orderStatus, setOrderStatus] = useState('');
    const searchParams = useSearchParams();
    
    const orderId = searchParams.get('orderId'); // Get the order ID value

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/checkStatus/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: orderId
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order status');
                }

                const data = await response.json();
                setOrderStatus(data.status);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrderStatus(); // Call the fetchOrderStatus function when the component mounts
    }, [orderId]);
    return (
        <div className='min-h-screen py-28 container'>
            <div className="top flex flex-col items-center">
                <Image alt='success' src={success} width={175} height={175} />
                <p className="text-3xl font-semibold pt-8">Order Placed Successfully!</p>
                <p className="text-lg font-medium pt-2  w-3/5 text-center">Thank you for choosing us. Keep and eye on your email for further updates on your order status.</p>
                <Button className="bg-[#030203] text-xl px-12 py-6 mt-10" asChild>
                    <Link href={'/'}>
                        Shop More
                    </Link>
                </Button>
            </div>
        </div>
    )
}
function SuspendedOrderSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderSuccess />
        </Suspense>
    );
}
export default SuspendedOrderSuccess