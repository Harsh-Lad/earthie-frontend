'use client'
// Import necessary modules
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import ProductCard from '@/app/components/Productcard/page';
import { Button } from '@/components/ui/button';
import cart from '@/public/cart.png';
import cartM from '@/public/cartM.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Define the Cart component
function Cart() {
  const auth = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter()
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const anonymousId = typeof window !== 'undefined' ? localStorage.getItem('anonymous_id') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchCartItems() {
    try {
      let response;
      if (auth) {
        // Fetch cart items for authenticated user
        response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-user-cart-items/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        // Fetch cart items for anonymous user
        response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-anonymous-cart-items/${anonymousId}/`, {
          method: 'GET',
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data.cart_items);
      setTotalPrice(data.total_price);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  useEffect(() => {
    if (token || anonymousId){
      fetchCartItems();
    }
  }, []);

  const handleProceedToCheckout = () => {
    // If user is not logged in, redirect to login page and display toast message
    if (!auth) {
      toast.error('Please login to proceed to checkout.');
      router.push('/login');
    } else {
      // Otherwise, navigate to the checkout page
      router.push('/checkout');
    }
  };

  // Render the Cart component
  return (
    <div className='w-screen min-h-screen'>
      <div className="header">
        <Image src={cart} alt='cart header' className='w-full h-auto object-cover hidden md:block' />
        <Image src={cartM} alt='cart header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="px-5 md:px-24 flex items-center justify-between">
          <p className="text-lg md:text-2xl font-semibold py-10">Cart Total: ₹ {totalPrice}</p>
          <Button className="rounded-full bg-[#030203]" onClick={handleProceedToCheckout} >
            Proceed to Checkout
          </Button>
        </div>
      )}
      <div className="px-5 md:px-24 flex flex-wrap justify-center md:justify-start">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <ProductCard key={index} product={item.product} />
          ))
        ) : (
          <p className='text-3xl font-semibold text-[#030203] mt-5'>Your cart is empty. Start shopping now!</p>
        )}
      </div>

    </div>
  );
}

// Export the Cart component
export default Cart;
