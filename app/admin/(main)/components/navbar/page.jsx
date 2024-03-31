import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Boxes, KanbanSquare, OptionIcon, Package, RulerIcon, ShirtIcon, User2Icon } from 'lucide-react'
import logo from '@/public/logo.png'

function Navbar() {
    return (
        <div className="w-1/5 bg-slate-50 shadow-md h-screen pt-6">
            <div className="top flex items-center justify-center">
                <Image alt='logo' src={logo} width={40} />
                <div className="flex flex-col items-start pl-6">
                    <Link href={'/'} className="heading text-3xl font-bold text-[#030203]">Earthie.in</Link>
                    <p className="subHead text-md font-medium text-slate-900">Wear Your Identity</p>
                </div>
            </div>

            <div className="bottom pt-8 px-2">
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 ">
                    <Link href={'/admin/dashboard'}><KanbanSquare className='mr-3' /> Dashboard</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/products'}><ShirtIcon className='mr-3' /> Products</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/collections'}><Boxes className='mr-3' /> Collections</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/categories'}><OptionIcon className='mr-3' /> Categories</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/sizes'}><RulerIcon className='mr-3' /> Sizes</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/users'}><User2Icon className='mr-3' /> Users</Link>
                </Button>
                <Button variant="secondary" asChild className="w-full text-left flex justify-start py-6 my-4">
                    <Link href={'/admin/orders'}><Package className='mr-3' /> Orders</Link>

                </Button>
            </div>
        </div>
    )
}

export default Navbar