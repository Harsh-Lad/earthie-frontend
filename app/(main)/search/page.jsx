'use client'

import ProductCard from '@/app/components/Productcard/page';
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    // Function to fetch all products initially
    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/search/`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Function to fetch products based on search query
    const fetchSearchResults = async () => {
        try {
            if (searchQuery.length >= 3) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/search/?query=${searchQuery}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                } else {
                    console.error('Failed to fetch search results');
                }
            } else {
                // If search query is empty, fetch all products again
                fetchAllProducts();
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // useEffect to fetch products based on search query
    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    // Function to handle input change
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <div className='min-h-screen relative'>
            <div className='w-[90%] bg-white border-2 shadow-md rounded-full p-1 fixed mt-20 ml-[5%]  z-50'>
                <Input placeholder="Search" className="border-none rounded-full focus-visible:ring-0 focus-visible:ring-white" value={searchQuery} onChange={handleInputChange} />
            </div>
            <div className="px-5 md:px-24 flex flex-wrap justify-center md:justify-start pt-36">
                {searchResults.length <= 0 && <p className='text-3xl font-semibold text-[#030203] mt-5'>No products found try again later.</p>}
                {searchResults.map(result => (
                    <ProductCard key={result.id} product={result} />
                ))}
            </div>
        </div>
    )
}

export default Search