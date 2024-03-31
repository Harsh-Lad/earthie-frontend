'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import newarrivals from '@/public/newarrivals.png'
import newarrivalsM from '@/public/newarrivalsM.png'
import ProductCard from '@/app/components/Productcard/page'


function NewArrivals() {
  const [products, setProducts] = useState([])

  async function fetchProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/?new_arrivals=true`);
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
    <div className='w-screen min-h-screen'>
      <div className="header">
        <Image unoptimized src={newarrivals} alt='collections header' className='w-full h-auto object-cover hidden md:block' />
        <Image unoptimized src={newarrivalsM} alt='collections header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      <div className="px-5 md:px-24 flex flex-wrap justify-center md:justify-start">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  )
}

export default NewArrivals