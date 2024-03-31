'use client'
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import ProductCard from '@/app/components/Productcard/page'
import Autoplay from "embla-carousel-autoplay"

function ProductSlider({ endpoint }) {
    const [products, setProducts] = useState([])

    async function fetchProducts() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/${endpoint}/`);
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
    }, [endpoint]); // Refetch when endpoint changes

    // useEffect(() => {
    //     console.log(products); // Log products whenever it changes
    // }, [products]);

    return (
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
                {products.map((product) => (
                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5 flex justify-center md:justify-start">
                        <ProductCard product={product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}

export default ProductSlider
