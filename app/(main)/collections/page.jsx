'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import collection from '@/public/collections.png'
import collectionM from '@/public/collectionsM.png'
import Collection from '@/app/components/collection/page'


function Collections() {

  const [allcollections, setCollections] = useState([])

  async function fetchCollections() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/collections/`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setCollections(data.collections);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []); // Refetch when endpoint changes



  return (
    <div className='w-screen min-h-screen'>
      <div className="header">
        <Image src={collection} alt='collections header' className='w-full h-auto object-cover hidden md:block' />
        <Image src={collectionM} alt='collections header' className='w-full h-auto object-cover block md:hidden' />
      </div>
      <div className=" px-5 md:px-24 flex flex-wrap justify-center md:justify-start">
        {
          allcollections.map((collection) => (
              <Collection collection={collection} key={collection.id}/>
          ))
        }

      </div>
    </div>
  )
}

export default Collections