'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { add } from 'date-fns'

function Checkout() {
    const router = useRouter()
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth.isLoggedIn)
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        pincode: ''
    });

    // State to store user or anonymous cart items
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderId, setOrderId] = useState('');
    const [price, setPrice] = useState(0)



    const fetchCartItems = async () => {
        try {
            let url;
            const token = localStorage.getItem('token');

            if (token) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/get-user-cart-items/`;
            } else {
                throw new Error('Authentication token or anonymous ID not provided.');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data.cart_items);
            setTotalPrice(data.total_price);

        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    useEffect(() => {
        if (auth) {
            fetchCartItems();
        }
        else {
            toast.error('Something went wrong!')
            router.push('/')
        }
    }, []);

    useEffect(() => {
        if (price > 0 && orderId !== '') {
            pay(); // Call pay() only when price and orderId are successfully set
        }
        console.log(orderId);
    }, [price, orderId]);

    const createOrder = async () => {
        if (!address.firstName || !address.lastName || !address.email || !address.phone || !address.addressLine1 || !address.state || !address.city || !address.pincode) {
            toast.error('Please fill in all the required fields');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/create-order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cart_items: cartItems.map(item => ({
                        orderItem: item.product.id, // Assuming `orderItem` represents the product ID
                        // Include other necessary fields for the order item
                    })),
                    total_amount: totalPrice,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    email: address.email,
                    phone: address.phone,
                    street_address: address.addressLine1 + ' ' + address.addressLine2,
                    city: address.city,
                    state: address.state,
                    postal_code: address.pincode,
                }),
            });


            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            setOrderId(data.payment_order.id)
            setPrice(data.payment_order.amount)

        } catch (error) {
            console.error(error);
            toast.error('Failed to create order. Please try again later.');
        }
    };

    // function pay() {
    //     var options = {
    //         // "key": 'rzp_live_pEyepar8NuQCjn', // Enter the Key ID generated from the Dashboard
    //         "key": 'rzp_test_dhTo8WSf0CUEtv', // Enter the Key ID generated from the Dashboard
    //         "amount": `${price}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //         "currency": "INR",
    //         "name": "Earthie Fashion",
    //         "description": "Wear your indentity",
    //         "order_id": `${orderId}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    //         "callback_url": `/ordersuccess?orderId=${orderId}`,

    //         "theme": {
    //             "color": "#030203"
    //         }
    //     };
    //     var rzp1 = new Razorpay(options);
    //     rzp1.open();

    // }

    function pay() {
        var options = {
            // "key": 'rzp_live_pEyepar8NuQCjn', // Enter the Key ID generated from the Dashboard
            "key": 'rzp_test_dhTo8WSf0CUEtv', // Enter the Key ID generated from the Dashboard
            "amount": `${price}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Earthie Fashion",
            "description": "Wear your identity",
            "order_id": `${orderId}`, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                // Handler function for successful payment
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);
                // Redirect to order success page or perform any other action
                handlePaymentSuccess(response);
            },
            "theme": {
                "color": "#030203"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

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


    const handlePaymentSuccess = async (response) => {
        try {
            // Perform any action here, such as updating the order status, redirecting to a success page, etc.
            fetchOrderStatus();
            console.log("Payment successful:", response);
            toast.success('Order Placed Successfully!')
            // Redirect to order success page
            router.push(`/ordersuccess?orderId=${orderId}`);
        } catch (error) {
            console.error("Failed to handle payment success:", error);
            toast.error('Failed to process payment. Please try again later.');
        }
    }


    return (
        <div className='min-h-screen'>
            <div className="container">
                <p className="text-4xl font-bold text-center pt-24">Checkout</p>
                <div className="pt-14 flex flex-col md:flex-row gap-6">
                    <div className="bottom w-4/4 md:w-3/5 ">
                        <div className="flex gap-3">
                            <div className="grid w-full max-w-sm items-center gap-1.5 ">
                                <Label htmlFor="name">First Name</Label>
                                <Input type="text" id="name" placeholder="First Name" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="lname">Last Name</Label>
                                <Input type="text" id="lname" placeholder="Last Name" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex gap-3 my-3">
                            <div className="grid w-full max-w-sm items-center gap-1.5 ">
                                <Label htmlFor="email">Email Id</Label>
                                <Input type="email" id="email" placeholder="Email id" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input type="tel" id="phone" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex gap-3 my-3">
                            <div className="grid w-full items-center gap-1.5 ">
                                <Label htmlFor="add">Address Line 1</Label>
                                <Input type="text" id="add" placeholder="Address Line 1" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex gap-3 my-3">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="add2">Address Line 2</Label>
                                <Input type="text" id="add2" placeholder="Address Line 2" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex gap-3 my-3">
                            <div className="grid w-full max-w-sm items-center gap-1.5 ">
                                <Label htmlFor="state">State</Label>
                                <Input type="text" id="state" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="city">City</Label>
                                <Input type="text" id="city" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="pincode">Pin Code</Label>
                                <Input type="number" id="pincode" placeholder="Pin Code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                            </div>
                        </div>

                        <Button className="w-full bg-[#030203] mt-14" onClick={() => { createOrder() }}>Checkout Now</Button>
                    </div>
                    <div className="preview w-4/4 md:w-2/5 flex flex-col items-end">
                        <p className='text-2xl text-right font-semibold mb-4'>Total Price: ₹{totalPrice}</p>
                        <ul className='w-full'>
                            {cartItems.map(item => (
                                <li key={item.id} className='my-4'>
                                    <Card className="flex">
                                        <Image unoptimized src={`${process.env.NEXT_PUBLIC_HOST}${item.product.thumbnail}`} width={360} height={360} className='w-28 aspect-square' alt='' />
                                        <div className="flex flex-col items-start p-4">
                                            <CardTitle>{item.product.productName}</CardTitle>
                                            <CardDescription>Size: {item.size}</CardDescription>
                                            {item.product.isInOffer ?
                                                <CardContent className="p-0 flex gap-1">
                                                    <p className=''>Price: ₹{item.product.offerPrice} </p>
                                                    <p className='line-through text-red-500'>₹{item.product.price} </p>
                                                </CardContent>
                                                :
                                                <CardContent className="p-0">
                                                    <p className=''>Price: ₹{item.product.price} </p>
                                                </CardContent>
                                            }
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Checkout