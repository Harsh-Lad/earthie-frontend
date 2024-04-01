'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart } from 'lucide-react'
import ProductSlider from '@/app/components/productSlider/page'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Product() {
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [token, setToken] = useState(undefined)
    const [anonymousId, setAnonymous_id] = useState(undefined)
    const auth = useSelector((state) => state.auth.isLoggedIn);
    const searchParams = useSearchParams()
    const productId = searchParams.get('productId')

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
                body: JSON.stringify({ product_id: productId, size:selectedSize }),
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
            const requestBody = { product_id: productId, size:selectedSize };

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
    const addToCart = async (productId, productName,size) => {
        try {
            if (auth) {
                const token = localStorage.getItem('token');
                await addToCartAuth(token, productId, productName,size);
            } else {
                await addToCartAnonymous(productId, productName,size);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add product to Cart. Please try again later.');
        }
    };


    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="">
            <div className=' w-4/4 pt-24 flex flex-col md:flex-row pb-12 min-h-screen p-4'>
                <div className="left w-4/4 md:w-3/5 lg:w-2/4 text-slate-800 flex flex-col lg:flex-row gap-3">
                    <div className="w-[100%] lg:w-[75%] left bg-slate-400  h-[100%] mainImage">
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
                        <p className="text-md font-semibold text-[#030203] lg:mt-4 lg:text-3xl">₹1199</p>

                    }
                    <p className="desc w-5/5 lg:w-3/5 py-3 pb-6 text-sm lg:mt-4 lg:text-md">
                        {product.description}
                    </p>

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
                        <Button className="px-10 mt-4" onClick={() => { addToCart(product.id, product.productName, selectedSize) }}>Add to Cart <ArrowRight /></Button>
                        <Button variant="secondary" className="px-10 mt-4">Add to Wishlist <Heart className='ml-2' /></Button>
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

function SuspendedProduct() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Product />
        </Suspense>
    );
}

export default SuspendedProduct