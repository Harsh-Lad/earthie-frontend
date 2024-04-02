'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import collection from '@/public/collections.png'
import collectionM from '@/public/collectionsM.png'
import ProductCard from '@/app/components/Productcard/page'
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'
function CollectionName() {


  const searchParams = useSearchParams();
  const collection_name = searchParams.get('collection_name');
  const [products, setProducts] = useState([])

  async function fetchProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/collections/?collection_name=${decodeURIComponent(collection_name)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []); // Refetch when endpoint changes

  return (
    <div className='w-screen'>
      <div className="header">
        <Image unoptimized src={collection} alt='collections header' className='w-full h-auto object-cover hidden md:block' />
        <Image unoptimized src={collectionM} alt='collections header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      <p className="text-4xl py-12 font-semibold text-[#030203] capitalize text-center">{decodeURIComponent(collection_name)}</p>
      <div className=" md:px-24 flex justify-center md:justify-start flex-wrap">
        {
          products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))
        }

      </div>
    </div>
  )
}

function SuspendedCollectionName() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionName />
    </Suspense>
  );
}

export default SuspendedCollectionName