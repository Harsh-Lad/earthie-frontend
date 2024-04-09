// 'use client'
// import React, { useState, useEffect } from 'react';
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { format, parseISO } from 'date-fns';
// import { ChevronDown } from 'lucide-react';

// function OrderHistory() {
//     const [orders, setOrders] = useState([]);
//     const [userName, setUserName] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         async function fetchOrders() {
//             try {
//                 const token = localStorage.getItem('token'); // Get access token from local storage

//                 const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetch-orders/`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`, // Include access token in the Authorization header
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch orders');
//                 }

//                 const data = await response.json();

//                 console.log(data);
//                 setOrders(data.orders);
//                 console.log(data.orders);
//                 setUserName(data.user_name);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error.message);
//                 setLoading(false);
//             }
//         }

//         fetchOrders();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div className='min-h-screen md:px-24 pt-36'>
//             <p className="text-4xl font-semibold">{userName}&apos;s Orders</p>
//             <ul>

//             </ul>
//         </div>
//     );
// }

// export default OrderHistory;



'use client'
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns'; // Import format function from date-fns
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';

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
                console.log(data);
                setOrders(data.orders);
                setUserName(data['user']['user ']);
                setLoading(false);

                console.log(data);
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='min-h-screen md:px-24 pt-36'>
            <p className="text-4xl font-semibold">{userName}&apos;s Orders</p>
            <ul>
                {orders && orders.map(order => (
                    <li key={order.id}>
                        <p>Order ID: {order.orderid}</p>
                        <p>Status: {order.status}</p>
                        <p>Total Amount: {order.total_amount}</p>
                        <p>Created At: {format(new Date(order.created_at), 'MMMM dd, yyyy HH:mm:ss')}</p>
                        <Collapsible>
                            <CollapsibleTrigger>
                                <ChevronDown />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <h3>Items:</h3>
                                <ul>
                                    {order.order_items && order.order_items.map(item => (
                                        <li key={item.id}>
                                            {item.email} - Size: {item.size}
                                        </li>
                                    ))}
                                </ul>
                            </CollapsibleContent>
                        </Collapsible>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrderHistory;
