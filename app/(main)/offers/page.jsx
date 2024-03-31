'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import offer from '@/public/offer.png'
import offerM from '@/public/offerM.png'
import ProductCard from '@/app/components/Productcard/page'


function Offers() {

  const [products, setProducts] = useState([])

  async function fetchProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/?offers=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []); // Refetch when endpoint changes

  return (
    <div className='w-screen min-h-screen  overflow-x-clip'>
      <div className="header">
        <Image unoptimized src={offer} alt='collections header' className='w-full h-auto object-cover hidden md:block' />
        <Image unoptimized src={offerM} alt='collections header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      <div className="px-5 md:px-24 flex flex-wrap justify-center md:justify-start">
        {products.length === 0 ? (
          <p className='text-3xl py-8 font-semibold'>No products are currently in offer...</p>
        ) : (
          products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))
        )}

      </div>
    </div>
  )
}

export default Offers