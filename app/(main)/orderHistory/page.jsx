'use client'
import React, { useState, useEffect } from 'react';
import Productcard from '@/app/components/Productcard/page';
import Image  from 'next/image';
import order from '@/public/orders.png'
import orderM from '@/public/ordersM.png'

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = localStorage.getItem('token'); // Get access token from local storage

                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetch-orders/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Include access token in the Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }


                const data = await response.json();
                setOrders(data['orderItems']);
                setUserName(data['user']['name']);
                setLoading(false);

            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchOrders();

    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-screen '>
            <div className="header">
                <Image src={order} alt='cart header' className='w-full h-auto object-cover hidden md:block' />
                <Image src={orderM} alt='cart header' className='w-full h-auto object-cover block md:hidden' />
            </div>
            <div className="md:px-24">
                {/* <p className="text-4xl font-semibold">{userName}&apos;s Orders</p> */}
                <div className="flex flex-wrap justify-center md:justify-start ">
                    {orders && orders.map(order => (
                        <Productcard key={order.order.id} orderDetail={order.order} status={order.status} product={order.orderItem} order={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
