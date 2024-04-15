'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from "@/components/ui/drawer"

function Productcard({ product, order, orderDetail, status, orderSize }) {
    const [wishlistItems, setWishlistItems] = useState([])
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isInCart, setIsInCart] = useState(false); // State to track whether the product is in the cart
    const [size, setSize] = useState('')
    const [selectedSize, setSelectedSize] = useState('');
    const anonymousId = typeof window !== 'undefined' ? localStorage.getItem('anonymous_id') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const auth = useSelector((state) => state.auth.isLoggedIn)
    const router = useRouter()
    const [timeoforder, setTimeoforder] = useState('')
    const [timeofDelivery, setTimeofDelivery] = useState('')

    const fetchWishlist = async () => {
        try {
            let url;
            if (auth) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/user-wishlist/`;
            } else if (anonymousId) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/anonymous-wishlist/${anonymousId}/`;
            } else {
                throw new Error('Authentication token or anonymous ID not provided.');
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth ? `Bearer ${token}` : undefined,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist items');
            }

            const data = await response.json();
            setWishlistItems(data);

            // Check if the product exists in the wishlist
            const productIds = data.map(item => item.product.id);
            setIsInWishlist(productIds.includes(product.id));
        } catch (error) {
            console.error('Failed to fetch wishlist items:', error);
        }
    };


    useEffect(() => {
        if (token || anonymousId) {
            fetchCartItems(); // Fetch cart items when component mounts
            fetchWishlist();
            console.log(orderDetail);
        }

    }, [token, anonymousId]);


    useEffect(() => {
        if (orderDetail) {
            setTimeoforder(new Date(orderDetail.created_at)); // Convert string to date object
            setTimeofDelivery(new Date(orderDetail.updated_at)); // Convert string to date object
        }
    }, [orderDetail]);

    const isCancelAllowed = () => {
        const currentTime = new Date();
        const timeDifference = currentTime - timeoforder;
        const hoursDifference = timeDifference / (1000 * 3600); // Convert milliseconds to hours

        return hoursDifference < 12; // Check if less than 12 hours
    };
    const isReplacedAllowed = () => {
        const currentTime = new Date();
        const timeDifference = currentTime - timeoforder;
        const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

        return daysDifference <= 7; // Check if less than or equal to 7 days
    };


    function handleSizeChange(size) {
        setSelectedSize(size);
    };

    const removeFromWishlist = async () => {
        try {
            let url;
            if (auth) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/remove_from_wishlist_authenticated/`;
            } else if (anonymousId) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/remove_from_wishlist_anonymous/`;
            } else {
                throw new Error('Authentication token or anonymous ID not provided.');
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify({ product_id: product.id, anonymous_id: anonymousId }),
            });

            console.log(response);
            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to remove product from wishlist');

            }

            toast.success(`${product.productName} removed from wishlist`);
            fetchWishlist(); // Refresh wishlist items after removal
        } catch (error) {
            console.error('Failed to remove product from wishlist:', error);
            alert('Failed to remove product from wishlist. Please try again later.');
        }
    };

    const addtoWishlist = async (productId, productName) => {
        if (isInWishlist) {
            removeFromWishlist();
        } else {
            try {
                if (auth) {
                    const token = localStorage.getItem('token');
                    await addToWishlistAuth(token, productId, productName);
                } else {
                    await addToWishlistAnonymous(productId, productName);
                }
                fetchWishlist(); // Refresh wishlist items after adding
            } catch (error) {
                console.error(error);
                alert('Failed to add product to wishlist. Please try again later.');
            }
        }
    };


    async function addToWishlistAuth(token, productId, productName) {
        try {
            if (auth) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add_to_wishlist_authenticated/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include your JWT token in the Authorization header
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: productId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add product to wishlist');
                }

                toast.success(`${productName} in wishlist`)
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add product to wishlist. Please try again later.');
        }
    };


    async function addToWishlistAnonymous(productId, productName) {
        try {

            let anonymousId = localStorage.getItem('anonymous_id');
            const requestBody = { product_id: productId };

            if (anonymousId) {
                requestBody.anonymous_id = anonymousId;
            }


            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add_to_wishlist_anonymous/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status == 400) {
                // throw new Error('Failed to add product to wishlist');
                toast.success(`${productName} already in wishlist`);
            }

            const data = await response.json();
            const { anonymous_id } = data;

            // Store anonymous_id in localStorage
            localStorage.setItem('anonymous_id', anonymous_id);

            toast.success(`${productName} in wishlist`);

        } catch (error) {
            console.error(error);
            alert('Failed to add product to wishlist. Please try again later.');
        }
    };

    const fetchCartItems = async () => {
        try {
            let url;
            if (auth) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/get-user-cart-items/`;
            } else {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/get-anonymous-cart-items/${anonymousId}/`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': auth ? `Bearer ${token}` : undefined,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            const productIds = data.cart_items.map(item => item.product.id);
            setIsInCart(productIds.includes(product.id));
            const cartItem = data.cart_items.find(item => item.product.id === product.id);
            // Extract the size if the cart item is found
            if (cartItem) {
                setSize(cartItem.size);
            }
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };


    async function removeFromCart(product_id, size) {
        try {
            let url;
            const token = localStorage.getItem('token');
            const anonymousId = localStorage.getItem('anonymous_id');

            if (token) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/remove-from-cart-authenticated/`;
            } else if (anonymousId) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/remove-from-cart-anonymous/`;
            } else {
                throw new Error('Authentication token or anonymous ID not provided.');
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify({
                    product_id: product_id,
                    size: size,
                    anonymous_id: anonymousId, // Include anonymous ID in the request
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from cart');
            }

            // Update the local state to remove the product from the cart
            setIsInCart(false);
            toast.success("Product removed from cart successfully!");
            fetchCartItems(); // Optionally, you can refresh the wishlist as well

        } catch (error) {
            console.error('Failed to remove product from cart:', error);
            toast.error('Failed to remove product from cart. Please try again later.');
        }
    }

    async function addToCartAuth(token, productId, productName) {
        if (selectedSize == '') {
            toast.error('Please select a relevant size to add the product to cart')
            return;
        }
        else {

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add-to-cart-authenticated/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include your JWT token in the Authorization header
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: productId, size: selectedSize }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add product to Cart');
                }

                toast.success(`${productName} in Cart`)
            } catch (error) {
                console.error(error);
                alert('Failed to add product to Cart. Please try again later.');
            }
        }

    };


    async function addToCartAnonymous(productId, productName, size) {
        if (selectedSize == '') {
            toast.error('Please select a relevant size to add the product to cart')
            return;
        }
        else {

            try {
                let anonymousId = localStorage.getItem('anonymous_id');
                const requestBody = { product_id: productId, size: selectedSize };

                if (anonymousId) {
                    requestBody.anonymous_id = anonymousId;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add-to-cart-anonymous/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error('Failed to add product to Cart');
                }

                const data = await response.json();
                const { anonymous_id } = data;

                // Store anonymous_id in localStorage
                localStorage.setItem('anonymous_id', anonymous_id);

                toast.success(`${productName} in Cart`);
            } catch (error) {
                console.error(error);
                alert('Failed to add product to Cart. Please try again later.');
            }
        }
    };
    const addToCart = async (productId, productName, size) => {
        try {
            if (auth) {
                const token = localStorage.getItem('token');
                await addToCartAuth(token, productId, productName, size);
            } else {
                await addToCartAnonymous(productId, productName, size);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add product to Cart. Please try again later.');
        }
    };

    async function cancelOrder(id) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/cancelOrder/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order status');
            }

            const data = await response.json();
            // toast.success(data.data)
            toast.success(data.data, { toastId: 'cancelOrderSuccess' }); // Add toastId to uniquely identify this toast
            window.location.reload()

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="">

            {product && (
                <div className='h-96 w-80 shadow bg-[#f2f2f2] relative overflow-hidden my-4 mx-2'>
                    <Image
                        alt=''
                        src={`${process.env.NEXT_PUBLIC_HOST}${product.thumbnail}`}
                        onClick={() => { router.push(`/product?productId=${product.id}`) }}
                        fill
                        className='cursor-pointer h-full w-full object-cover object-center'
                    />

                    <div className="content px-2 absolute bottom-0 w-full mb-4">
                        <div className="top w-full flex">
                            <p className="bg-white w-[75%] px-3 py-3 text-[#030203] font-semibold">{product.productName}</p>
                            <p className="bg-[#030203] w-[25%] px-3 py-3 text-white font-semibold text-center"> ₹{product.isInOffer ? product.offerPrice : product.price}</p>
                        </div>

                        {order && order ?
                            <div className="">
                                {isCancelAllowed() && status != 'cancelled' ? (
                                    <Button className="rounded-none w-full bg-[#030203] hover:bg-[#000000] mt-2" onClick={() => { cancelOrder(product.id) }}>
                                        Cancel Order
                                    </Button>
                                ) : (
                                    <div className="">
                                        {status == 'delivered' && isReplacedAllowed() ?
                                            <Button className="rounded-none w-full capitalize bg-[#030203] hover:bg-[#000000] mt-2">
                                                Replace Order
                                            </Button>
                                            :
                                            <Button className="rounded-none w-full capitalize bg-[#030203] hover:bg-[#000000] mt-2">
                                                {status}
                                            </Button>
                                        }
                                    </div>
                                )}
                            </div>
                            :
                            <div className="bottom">
                                {isInCart ? (
                                    <div className=" flex gap-2">
                                        <Button className="w-2/4 rounded-none mt-2 bg-[#fff] hover:bg-[#f5f5f5] text-[#030203] border-2 shadow-md" onClick={() => { if (token || anonymousId) { removeFromCart(product.id, size) } else { toast.warning('Something went wrong') } }}>
                                            Remove from Cart
                                        </Button>
                                        <Button className="w-2/4 rounded-none mt-2 bg-[#fff] hover:bg-[#f5f5f5] text-[#030203] border-2 shadow-md" onClick={() => { router.push('/cart') }} >
                                            Go to Cart
                                        </Button>
                                    </div>
                                ) : (
                                    <Drawer className=" container">
                                        <DrawerTrigger className='w-full mt-2'>
                                            <Button className="rounded-none w-full bg-[#030203] hover:bg-[#000000]" >
                                                Add to Cart
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent className="px-4 md:px-24 lg:px-48 ">
                                            <div className="px-4 w-full flex flex-col gap-3 md:gap-0 md:flex-row py-2">
                                                <div className=" w-4/4 md:w-2/4 lg:w-3/4 ">
                                                    <p className="text-xl md:text-2xl lg:text-4xl font-semibold">Add {product.productName} to cart</p>
                                                    <p className="text-lg md:text-3xl my-0 md:my-2 font-semibold text-left"> ₹{product.isInOffer ? product.offerPrice : product.price}</p>
                                                    <p className="text-xl font-semibold">Select a size</p>
                                                    <div className='flex gap-1 my-2'>
                                                        <input className='hidden' type="radio" id="sizeS" name="size" value="S" onChange={() => handleSizeChange("S")} checked={selectedSize === "S"} />
                                                        <label className={`cursor-pointer h-12 w-12 flex items-center justify-center font-semibold border-2 rounded-md ${selectedSize === "S" ? 'bg-[#030203] text-white' : ' bg-slate-100'}`} htmlFor="sizeS">S</label>

                                                        <input className='hidden' type="radio" id="sizeM" name="size" value="M" onChange={() => handleSizeChange("M")} checked={selectedSize === "M"} />
                                                        <label className={`cursor-pointer h-12 w-12 flex items-center justify-center font-semibold border-2 rounded-md ${selectedSize === "M" ? 'bg-[#030203] text-white' : ' bg-slate-100'}`} htmlFor="sizeM">M</label>

                                                        <input className='hidden' type="radio" id="sizeL" name="size" value="L" onChange={() => handleSizeChange("L")} checked={selectedSize === "L"} />
                                                        <label className={`cursor-pointer h-12 w-12 flex items-center justify-center font-semibold border-2 rounded-md ${selectedSize === "L" ? 'bg-[#030203] text-white' : ' bg-slate-100'}`} htmlFor="sizeL">L</label>

                                                        <input className='hidden' type="radio" id="sizeXL" name="size" value="XL" onChange={() => handleSizeChange("XL")} checked={selectedSize === "XL"} />
                                                        <label className={`cursor-pointer h-12 w-12 flex items-center justify-center font-semibold border-2 rounded-md ${selectedSize === "XL" ? 'bg-[#030203] text-white' : ' bg-slate-100'}`} htmlFor="sizeXL">XL</label>

                                                        <input className='hidden' type="radio" id="sizeXXL" name="size" value="XXL" onChange={() => handleSizeChange("XXL")} checked={selectedSize === "XXL"} />
                                                        <label className={`cursor-pointer h-12 w-12 flex items-center justify-center font-semibold border-2 rounded-md ${selectedSize === "XXL" ? 'bg-[#030203] text-white' : ' bg-slate-100'}`} htmlFor="sizeXXL">XXL</label>

                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Button className="w-4/4 md:w-2/4" onClick={() => { addToCart(product.id, product.productName, selectedSize) }}>Add to Cart</Button>
                                                        <DrawerClose className="w-4/4 md:w-2/4">
                                                            <Button variant="outline" className="w-full mt-2">Cancel</Button>
                                                        </DrawerClose>
                                                    </div>
                                                </div>

                                                <div className=" w-4/4 md:w-2/4 lg:w-1/4">
                                                    <Image
                                                        alt=''
                                                        width={340}
                                                        height={145}
                                                        src={`${process.env.NEXT_PUBLIC_HOST}${product.thumbnail}`}
                                                        onClick={() => { router.push(`/product?productId=${product.id}`) }}
                                                        className='cursor-pointer aspect-auto object-cover object-center'
                                                    />
                                                </div>
                                            </div>

                                            <DrawerFooter>

                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>

                                )}
                            </div>
                        }
                    </div>

                    <div className="wishList absolute top-0 w-full">
                        {order && order ?
                            <div className="w-full">
                                {
                                    <p className='text-white bg-gradient-to-b from-black/40 w-full py-4 text-center font-semibold capitalize'>{status}</p>
                                }
                            </div>
                            :
                            <div className="mt-2 flex items-center justify-between w-full px-3">
                                <Button variant="secondary" className=" rounded-none bg-white shadow-lg" onClick={() => { addtoWishlist(product.id, product.productName) }}>  <Heart stroke={isInWishlist ? 'red' : 'black'} fill={isInWishlist ? 'red' : 'white'} /></Button>
                                {
                                    product.isInOffer &&
                                    <p className="text-red-500 bg-white py-2 px-2 font-medium">{product.offerName}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            )}
        </div>

    )
}

export default Productcard