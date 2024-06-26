'use client'
import React, { useEffect, useState } from 'react'
import logo from '@/public/EarthieLogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Heart, LogOut, LucideMenu, Plus ,LucideShoppingCart, LogIn ,Package, Search, User2Icon, BadgePercent, Shirt, Boxes, Triangle} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname, useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '@/redux/auth/authSlice'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'

function Navbar() {
  const pathname = usePathname();
  const isSignupPage = pathname === '/signup';
  const auth = useSelector((state) => state.auth.isLoggedIn)
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(login())
    }
    else {
      dispatch(logout())
    }

  }, [dispatch])
  return (
    <div className='w-[90%] bg-[#030203] rounded-full p-2 fixed mt-5 ml-[5%]  z-50'>
      <div className="flex justify-between items-center relative">
        <div className="left">

          <Link href={'/'}>
            <Image alt='logo' src={logo} />
          </Link>
        </div>
        <div className="center hidden md:flex absolute left-1/2 translate-x-[-50%]">
          <Link className='text-white hover:text-slate-200 mx-4' href={'/'}>Home</Link>
          <Link className='text-white hover:text-slate-200 mx-4' href={'/collections'}>Collections</Link>
          <Link className='text-white hover:text-slate-200 mx-4' href={'/offers'}>Offers</Link>
          <Link className='text-white hover:text-slate-200 mx-4' href={'/newarrivals'}>New Arrivals</Link>
        </div>
        <div className="right flex">
          <div className="left flex gap-3 items-center pr-2">
            <Link href={'/search'}><Search className='text-white ' size={20} /></Link>
            <Link href={'/wishlist'}><Heart className='text-white ' size={20} /></Link>
            <Link href={'/cart'}><LucideShoppingCart className='text-white ' size={20} /></Link>
          </div>

          <div className="right hidden md:flex items-center">

            {auth && ( // Conditionally render account link only if token exists
              <Popover>
                <PopoverTrigger> <User2Icon className='text-white mr-2' size={20} /></PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 relative right-24 top-4">
                  <Button asChild variant='secondary' className="text-left flex justify-start">
                    <Link href={'/orderHistory'} className='text-center'><Package className='mr-2' /> My orders</Link>
                  </Button>
                  {/* <Button asChild variant='secondary' className="text-left flex justify-start">
                    <Link href={'/orderHistory'} className='text-center'><Edit className='mr-2' /> Edit Profile</Link>
                  </Button> */}
                  <Button variant='destructive' className="text-left flex justify-start" onClick={() => { dispatch(logout()); localStorage.removeItem('token'); router.push('/login'); toast.success('Logged out successfully!') }}>
                    <LogOut className='mr-2 text-whtite' /> Logout
                  </Button>
                </PopoverContent>
              </Popover>
            )}


            {auth ||
              <div className="">
                {isSignupPage ? (
                  <Button asChild variant="secondary" className="rounded-full h-9 ml-2">
                    <Link href={'/login'}>Login</Link>
                  </Button>
                ) : (
                  <Button asChild variant="secondary" className="rounded-full h-9 ml-2">
                    <Link href={'/signup'}>Signup</Link>
                  </Button>
                )}
              </div>
            }
          </div>

          <div className="mobile flex items-center md:hidden">
            <Sheet>
              <SheetTrigger><LucideMenu className='text-white' /></SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-left py-2 flex items-center"><Image alt='logo' src={logo} width={45} height={45}/> EarthieFashion.</SheetTitle>
                  <SheetDescription className="flex flex-col items-start gap-y-2">
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/'}><Shirt className="mr-2" /> Home</Link>
                    </Button>
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/collections'}><Boxes className="mr-2" /> Collections</Link>
                    </Button>
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/offers'}><BadgePercent className="mr-2"/> Offers</Link>
                    </Button>
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/newarrivals'}><Triangle className="mr-2"/> New Arrivals</Link>
                    </Button>
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/cart'}><LucideShoppingCart className='mr-2'/> Cart</Link>
                    </Button>
                    <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                      <Link className=' hover:text-slate-200 ' href={'/wishlist'}><Heart className='mr-2'/> Wishlist</Link>
                    </Button>
                    {auth ?
                      <div className="flex flex-col items-start gap-3 w-full">
                        <Button asChild variant='secondary' className="text-left flex justify-start w-full" onClick={() => closeSheet()}>
                          <Link href={'/orderHistory'} className='text-center'><Package className=' mr-2' /> My orders</Link>
                        </Button>
                        <Button variant='destructive' className="w-full text-left flex justify-start" onClick={() => { dispatch(logout()); localStorage.removeItem('token'); router.push('/login'); toast.success('Logged out successfully!') }}>
                          <LogOut className='mr-2 text-whtite' /> Logout
                        </Button>
                      </div>
                      :
                      <div className="flex flex-col gap-2 w-full">
                        <Button asChild className="flex justify-start">
                          <Link href={'/login'}><LogIn  className='mr-2'/> Login</Link>
                        </Button>
                        <Button variant="secondary" asChild className="flex justify-start">
                          <Link href={'/signup'}><Plus className='mr-2'/> Signup</Link>
                        </Button>
                      </div>
                    }

                    {/* <Link className=' hover:text-slate-200 ' href={'/'}></Link> */}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <LoadingBar color='#030203' />
    </div>
  )
}

export default Navbar