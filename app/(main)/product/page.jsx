'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart } from 'lucide-react'
import ProductSlider from '@/app/components/productSlider/page'
import Image from 'next/image'
import chart from '@/public/sizing.png'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton'

function Product() {
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [token, setToken] = useState(undefined)
    const [anonymousId, setAnonymous_id] = useState(undefined)
    const auth = useSelector((state) => state.auth.isLoggedIn);
    const searchParams = useSearchParams()
    const productId = searchParams.get('productId')
    const [IsInCart, setIsInCart] = useState(false)

    useEffect(() => {
        setAnonymous_id(localStorage.getItem('anonymous_id'));
        setToken(localStorage.getItem('token'));

        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/${productId}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData = await response.json();
                setProduct(productData);
                setMainImage(productData.thumbnail);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSupportingImageClick = (image) => {
        setMainImage(image);
    };

    function handleSizeChange(size) {
        setSelectedSize(size);
    };

    const fetchCartItems = async () => {
        try {
            let url;
            if (auth && anonymousId !== undefined) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/get-user-cart-items/`;
            } else if (anonymousId) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/get-anonymous-cart-items/${anonymousId}/`;
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
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setIsInCart(data.some(item => item.product.id === product.id));
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    useEffect(() => {
        if (auth && anonymousId !== undefined) {
            fetchCartItems();
        }
    }, [auth, token, anonymousId]);

    const removeFromCart = async () => {
        try {
            let url;
            if (auth) {
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
                    'Authorization': auth ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify({ product_id: product.id, size: selectedSize }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from cart');
            }

            toast.success(`${product.productName} removed from cart`);
            fetchCartItems(); // Refresh cart items after removal
        } catch (error) {
            console.error('Failed to remove product from cart:', error);
            alert('Failed to remove product from cart. Please try again later.');
        }
    };
    async function addToCartAuth(token, productId, productName, size) {
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
    };


    async function addToCartAnonymous(productId, productName, size) {

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


    if (!product) {
        return <LoadingProduct/>
    }

    return (
        <div className="">
            <div className=' w-4/4 pt-24 flex flex-col md:flex-row pb-12 min-h-screen p-4'>
                <div className="left w-4/4 md:w-3/5 lg:w-2/4 text-slate-100 flex flex-col lg:flex-row gap-3">
                    <div className="w-[100%] lg:w-[75%] left bg-slate-100  h-[100%] mainImage">
                        <Image src={`${process.env.NEXT_PUBLIC_HOST}${mainImage}`} alt='' width={1080} height={720} className='h-full w-full object-cover' />
                    </div>
                    <div className="flex flex-row w-[100%] lg:w-[25%] lg:flex-col gap-3 supportImage">
                        <div className="w-[100%] left bg-slate-100 h-full" onClick={() => handleSupportingImageClick(product.thumbnail)}>
                            <Image src={`${process.env.NEXT_PUBLIC_HOST}${product.thumbnail}`} alt='' width={1080} height={720} className='h-full w-full object-cover cursor-pointer' />
                        </div>
                        <div className="w-[100%] left bg-slate-100 h-full" onClick={() => handleSupportingImageClick(product.second)}>
                            <Image src={`${process.env.NEXT_PUBLIC_HOST}${product.second}`} alt='' width={1080} height={720} className='h-full w-full object-cover cursor-pointer' />
                        </div>
                        <div className="w-[100%] left bg-slate-100 h-full" onClick={() => handleSupportingImageClick(product.third)}>
                            <Image src={`${process.env.NEXT_PUBLIC_HOST}${product.third}`} alt='' width={1080} height={720} className='h-full w-full object-cover cursor-pointer' />
                        </div>
                    </div>

                </div>
                <div className="right w-4/4 md:w-2/5 lg:w-2/4 md:p-4 lg:p-0 lg:pl-10">
                    <p className="text-2xl lg:text-5xl mt-4 font-semibold text-[#030203]">{product.productName}</p>
                    {product.collection != null &&

                        <p className="text-lg font-medium text-[#030203] lg:mt-4 lg:text-xl ">{product.collection.collectionName}</p>
                    }
                    {product.isInOffer ?

                        <div className="flex items-center gap-2">
                            <p className="text-md font-semibold lg:mt-4 lg:text-2xl line-through text-red-600">₹{product.price}</p>
                            <p className="text-md font-semibold text-[#030203] lg:mt-4 lg:text-2xl">₹{product.offerPrice}</p>

                        </div>

                        :
                        <p className="text-md font-semibold text-[#030203] lg:mt-4 lg:text-3xl">₹{product.price}</p>

                    }
                    <p className="desc w-5/5 lg:w-3/5 py-3 pb-6 text-sm lg:mt-4 lg:text-md">
                        {product.description}
                    </p>

                    <div className="">{ }</div>

                    <div className="mb-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild className=''>
                                <div className="flex gap-2 items-center">
                                    <Image src={chart} alt='sizing chart' width={34} className='cursor-pointer' />
                                    <p className="text-underline underline cursor-pointer">
                                        Show Size Chart
                                    </p>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    {/* <AlertDialogTitle>Unisex Oversized Size Chart </AlertDialogTitle> */}
                                    <AlertDialogDescription>
                                        <Image src={process.env.NEXT_PUBLIC_HOST + product.category.sizeChart} alt='size chart' width={768} height={768} className='w-full h-full' />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <p className="text-xl font-semibold">Select a size</p>
                    <div className='flex gap-1'>
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


                        {/* Add more radio buttons for other sizes */}
                    </div>


                    <div className="cta flex gap-2 flex-col lg:flex-row">
                        <Button className="px-10 mt-4 bg-[#030203] rounded-none hover:bg-[#020102]" onClick={() => { addToCart(product.id, product.productName, selectedSize) }}>Add to Cart <ArrowRight /></Button>
                        {/* <Button variant="secondary" className="px-10 mt-4">Add to Wishlist <Heart className='ml-2' /></Button> */}
                    </div>
                </div>


            </div>

            <div className="">
                <p className="text-2xl font-bold text-[#030203] pl-4">New Arrivals</p>
                <ProductSlider endpoint={'products/?new_arrivals=true'} />
            </div>


        </div>

    )
}

function LoadingProduct() {
    return (
        <div className="">
            <div className=' w-4/4 pt-24 flex flex-col md:flex-row pb-12 min-h-screen p-4'>
                <div className="left w-4/4 md:w-3/5 lg:w-2/4 text-slate-100 flex flex-col lg:flex-row gap-3">
                    <div className="w-[100%] lg:w-[75%] left bg-slate-100  h-[100%] mainImage">
                        thumb
                    </div>
                    <div className="flex flex-row w-[100%] lg:w-[25%] lg:flex-col gap-3 supportImage">
                        <div className="w-[100%] left bg-slate-100 h-full" >
                            thumb
                        </div>
                        <div className="w-[100%] left bg-slate-100 h-full" >
                            image1
                        </div>
                        <div className="w-[100%] left bg-slate-100 h-full" >
                            image2
                        </div>
                    </div>

                </div>
                <div className="right w-4/4 md:w-2/5 lg:w-2/4 md:p-4 lg:p-0 lg:pl-10">
                    <p className="text-2xl lg:text-5xl mt-4 font-semibold text-[#030203]">Loading</p>
                    price
                    <p className="desc w-5/5 lg:w-3/5 py-3 pb-6 text-sm lg:mt-4 lg:text-md">
                    </p>





                    <p className="text-xl font-semibold">Select a size</p>



                    <div className="cta flex gap-2 flex-col lg:flex-row">

                        {/* <Button variant="secondary" className="px-10 mt-4">Add to Wishlist <Heart className='ml-2' /></Button> */}
                    </div>
                </div>


            </div>
        </div>

    )
}

function SuspendedProduct() {
    return (
        <Suspense fallback={<LoadingProduct />}>
            <Product />
        </Suspense>
    );
}

export default SuspendedProduct