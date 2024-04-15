'use client'
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

function Blocks() {
    const [blocks, setBlocks] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    async function getBlocks() {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_HOST + '/api/blocks/');
            const data = response.data
            setBlocks(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setError(error)
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getBlocks()
    }, [])

    if (isLoading){
        return(
            <div className="row w-4/4 flex flex-col md:flex-row p-3 gap-2">
                <Skeleton className="w-4/4 md:w-2/4 aspect-square bg-slate-200">

                </Skeleton>
                <Skeleton className="w-4/4 md:w-2/4 aspect-square bg-slate-200">

                </Skeleton>
            </div>
        )
    }
    return (
        <div className="row w-4/4 flex flex-col md:flex-row p-3 gap-2">
            {blocks.length > 0 && (
                blocks.map((slide, index) => (
                    <div className="w-4/4 md:w-2/4" key={index}>
                        <Link href={slide.link}>
                        <Image src={`${process.env.NEXT_PUBLIC_HOST}${slide.blockImage}`} alt="" width={1024} height={768} className="w-full h-auto object-cover" />
                        </Link>
                    </div>
                )))}
        </div>
    )
}

export default Blocks