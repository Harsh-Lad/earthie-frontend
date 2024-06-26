'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import wishlist from '@/public/wishlist.png'
import wishlistM from '@/public/wishlistM.png'
import { useSelector } from 'react-redux'
import ProductCard from '@/app/components/Productcard/page'

function Wishlist() {
  const auth = useSelector((state) => state.auth.isLoggedIn)
  const [wishlistItems, setWishlistItems] = useState([])
  const [reload, setReload] = useState(false);


  useEffect(() => {
    async function fetchWishlistItems() {
      try {
        let response
        if (auth) {
          // Fetch wishlist items for authenticated user
          const token = localStorage.getItem('token')
          response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user-wishlist/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              cache: 'no-store'
            },
          })
        } else {
          // Fetch wishlist items for anonymous user
          const anonymousId = localStorage.getItem('anonymous_id')
          response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/anonymous-wishlist/${anonymousId}/`, {
            method: 'GET',
            cache: 'no-store'
          })
        }

        if (!response.ok) {
          throw new Error('Failed to fetch wishlist items')
        }

        const data = await response.json()
        setWishlistItems(data)
      } catch (error) {
        console.error(error)
        // Handle error
      }
    }

    fetchWishlistItems()
  }, [auth])

  return (
    <div className='w-screen min-h-screen'>
      <div className="header">
        <Image src={wishlist} alt='collections header' className='w-full h-auto object-cover hidden md:block' />
        <Image src={wishlistM} alt='collections header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      <div className="px-5 md:px-24 flex flex-wrap justify-center md:justify-start">

        {wishlistItems.length > 0 ? (
          wishlistItems.map((item, index) => (
            <ProductCard key={index} product={item.product} reload={[reload, setReload]}/>
          ))
        ) : (
          <p className='text-3xl font-semibold text-[#030203] mt-5'>No products in wishlist. Add some products!</p>
        )}
      </div>
    </div>
  )
}

export default Wishlist