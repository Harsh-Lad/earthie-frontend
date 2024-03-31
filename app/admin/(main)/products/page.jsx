'use client'
import React from 'react'
import logo from '@/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'


function Products() {
  return (
    <div className="w-4/5 h-screen px-12 pt-10">
      <p className="text-5xl font-bold text-[#030203] pb-8">Products</p>
      <div className="addProd w-5/5 flex">
        <div className="w-2/5">
          <div className="imgContain w-full pr-5 py-2 flex-col">
            <div className="thumb w-full rounded-md bg-slate-50 h-72 object-cover shadow-sm">
              f
            </div>
            <div className="flex gap-1.5 pt-2">
              <div className="w-2/4 bg-slate-50 h-36 object-cover shadow-sm">ww</div>
              <div className="w-2/4 bg-slate-50 h-36 object-cover shadow-sm">w</div>
            </div>
          </div>
        </div>
        <div className="w-3/5 ">
          <div className="row1 flex gap-3">
            <div className="w-2/4">
              <Label className='pb-2'>Product Name</Label>
              <Input placeholder="Product Name" />
            </div>
            <div className="w-2/4">
              <Label className='pb-2'>Product Price</Label>
              <Input type="number" placeholder="Product Price" />
            </div>
          </div>
          <div className="row2 flex gap-3">
            <div className="w-2/5">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
              >
               Is In Offer
              </label>
            </div>
            <div className="w-2/4">
              <Label className='pb-2'>Product Price</Label>
              <Input type="number" placeholder="Product Price" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products