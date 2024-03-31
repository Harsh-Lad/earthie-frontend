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

function Slider() {
    const [slides, setSlides] = useState({})

    async function getSlides() {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_HOST + '/api/slides/');
            const data = response.data
            setSlides(data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getSlides()
    }, [])

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
                                <Image
                                    unoptimized
                                    alt={`slide ${index + 1}`}
                                    src={`${process.env.NEXT_PUBLIC_HOST}${slide.desktopImage}`}
                                    className='w-full h-auto object-cover hidden md:block'
                                    width={1920}
                                    height={700}
                                />
                                <Image
                                    unoptimized
                                    alt={`slide ${index + 1}`}
                                    src={`${process.env.NEXT_PUBLIC_HOST}${slide.mobileImage}`}
                                    className='w-full h-auto object-cover  md:hidden bg-[#f2f2f2] flex items-center justify-center'
                                    width={1920}
                                    height={1080}
                                />
                            </CarouselItem>

                        ))
                    )}
                </CarouselContent>
            </Carousel>

        </div>

    )
}

export default Slider