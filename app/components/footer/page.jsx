import React from 'react'
import logo from '@/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'

function Footer() {
  return (
    <div className='p-3'>
      <footer className=' w-4/4 bg-[#F9FAFC] p-4 py-8 flex flex-col gap-y-8 md:flex-row'>
        <div className="first w-4/4 md:w-1/4 pl-10">
          <div className="top flex flex-col items-start">
            <div className="flex flex-col items-center">
              <Image src={logo} alt='' className='' />
              <p className="text-3xl font-bold">Earthie.in</p>
            </div>
            <p className='w-3/4 md:w-2/3 mt-4'>Unleash your fashion game with state of the art Street Wear collection brought to you by Earthie Fashion. Wear your Identity.</p>

          </div>

        </div>

        <div className="second w-4/4  md:w-1/4 pl-10">
          <p className="text-2xl font-semibold">Quick Links</p>
          <div className="flex flex-col gap-y-2 mt-2">
            <Link className='text-lg font-medium' href={'/'}>Home Page</Link>
            <Link className='text-lg font-medium' href={'/collections'}>Collections</Link>
            <Link className='text-lg font-medium' href={'/offers'}>Offers</Link>
            <Link className='text-lg font-medium' href={'/newarrivals'}>New Arrivals</Link>
            <Link className='text-lg font-medium' href={'/cart'}>Cart</Link>
            <Link className='text-lg font-medium' href={'/wishlist'}>Wishlists</Link>
          </div>
        </div>

        <div className="third w-4/4  md:w-1/4 pl-10">
          <p className="text-2xl font-semibold">Policies</p>
          <div className="flex flex-col gap-y-2 mt-2">
            <p className="text-lg font-medium">Call us at:</p>
            <p className="text-lg font-medium">+91 8369088360</p>
            <p className="text-lg font-medium">Email us at:</p>
            <p className="text-lg font-medium">support@earthie.in</p>
            <p className="text-lg font-medium">Office Address:</p>
            <p className="text-lg font-medium lowercase w-2/3">SHRIDHAR KUNJ PLOT NO:246-259, RSC 1A, GORAI-1, BORIVALI WEST, MUMBAI-92.</p>
          </div>
        </div>

        <div className="fourth w-4/4  md:w-1/4 pl-10">
          <p className="text-2xl font-semibold">Policies</p>
          <div className="flex flex-col gap-y-2 mt-2">
            <Link className='text-lg font-medium' href={'/privacypolicy'}>Privacy Policy</Link>
            <Link className='text-lg font-medium' href={'/terms&conditions'}>Terms & Conditions</Link>
            <Link className='text-lg font-medium' href={'/refundreturn'}>Refund & Return Policy</Link>
            <Link className='text-lg font-medium' href={'/cancellation'}>Cancellation Policy</Link>
            <Link className='text-lg font-medium' href={'/shipping'}>Shipping Policy</Link>
            <Link className='text-lg font-medium' href={'/about'}>About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer