'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

function Productcard({ product }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isInCart, setIsInCart] = useState(false); // State to track whether the product is in the cart
    const [size, setSize] = useState('')
    // const anonymousId = typeof window !== 'undefined' ? localStorage.getItem('anonymous_id') : null;
    const anonymousId = localStorage.getItem('anonymous_id');
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const token = localStorage.getItem('token');
    const auth = useSelector((state) => state.auth.isLoggedIn)
    const router = useRouter()

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
            console.log(isInWishlist);
        } catch (error) {
            console.error('Failed to fetch wishlist items:', error);
        }
    };


    useEffect(() => {
        fetchCartItems(); // Fetch cart items when component mounts
        fetchWishlist();
    }, []);


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

            if (!response.ok) {
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

            console.log(requestBody);

            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add_to_wishlist_anonymous/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log(response);
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
            console.log(isInCart);
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

            if (token && typeof window !== 'undefined') {
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

                    {/* <Image alt='' src={`${process.env.NEXT_PUBLIC_HOST}${product.thumbnail}`} onClick={() => { router.push(`/product?productId=${product.id}`) }} fill className='cursor-pointer h-full w-full object-cover object-center' /> */}
                    <div className="content px-2 absolute bottom-0 w-full mb-4">
                        <div className="top w-full flex">
                            <p className="bg-white w-[75%] px-3 py-3 text-[#030203] font-semibold">{product.productName}</p>
                            <p className="bg-[#030203] w-[25%] px-3 py-3 text-white font-semibold text-center"> ₹{product.isInOffer ? product.offerPrice : product.price}</p>
                        </div>
                        <div className="bottom">
                            {isInCart ? (
                                <Button className="rounded-none w-full mt-2 bg-[#fff] hover:bg-[#f5f5f5] text-[#030203] border-2 shadow-md" onClick={() => { removeFromCart(product.id, size) }}>
                                    Remove from Cart
                                </Button>
                            ) : (
                                <Button className="rounded-none w-full mt-2 bg-[#030203] hover:bg-[#000000]" onClick={() => { router.push(`/product?productId=${product.id}`) }}>
                                    View
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="wishList absolute top-0 mt-2 flex items-center justify-between w-full px-3">
                        <Button variant="secondary" className=" rounded-none bg-white shadow-lg" onClick={() => { addtoWishlist(product.id, product.productName) }}>  <Heart stroke={isInWishlist ? 'red' : 'black'} fill={isInWishlist ? 'red' : 'white'} /></Button>

                        {
                            product.isInOffer &&
                            <p className="text-red-500 bg-white py-2 px-2 font-medium">{product.offerName}</p>
                        }
                    </div>
                </div>
            )}
        </div>

    )
}

export default Productcard