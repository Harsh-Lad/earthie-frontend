'use client'
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
function Slider() {
    const [slides, setSlides] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getSlides() {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_HOST + '/api/slides/');
            const data = response.data
            setSlides(data);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            setIsLoading(false);
            console.error(error);
        }
    }
    useEffect(() => {
        getSlides()
    }, [])

    if (isLoading) {
        return (
            <Skeleton className="w-full h-[70vh] bg-slate-200" />
        )
    }

    return (
        <div className="">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
            >
                <CarouselContent>
                    {slides.length > 0 && (
                        slides.map((slide, index) => (
                            <CarouselItem key={index}>
                                <Link href={slide.link}>
                                    <Image
                                        alt={`slide ${index + 1}`}
                                        src={`${process.env.NEXT_PUBLIC_HOST}${slide.desktopImage}`}
                                        className='w-full h-auto object-cover hidden md:block'
                                        width={1920}
                                        height={700}
                                    />
                                </Link>
                                <Link href={slide.link}>
                                <Image
                                    alt={`slide ${index + 1}`}
                                    src={`${process.env.NEXT_PUBLIC_HOST}${slide.mobileImage}`}
                                    className='w-full h-auto object-cover  md:hidden bg-[#f2f2f2] flex items-center justify-center'
                                    width={1920}
                                    height={1080}
                                />
                                </Link>
                            </CarouselItem>

                        ))
                    )}
                </CarouselContent>
            </Carousel>

        </div>

    )
}

export default Slider