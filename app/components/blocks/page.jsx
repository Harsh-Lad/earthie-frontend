'use client'
import axios from 'axios';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function Blocks() {
    const [blocks, setBlocks] = useState({})

    async function getBlocks() {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_HOST + '/api/blocks/');
            const data = response.data
            setBlocks(data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getBlocks()
    }, [])
    return (
        <div className="row w-4/4 flex flex-col md:flex-row p-3 gap-2">
            {blocks.length > 0 && (
                blocks.map((slide, index) => (
                    <div className="w-4/4 md:w-2/4" key={index}>
                        <Image unoptimized src={`${process.env.NEXT_PUBLIC_HOST}${slide.blockImage}`} alt="" width={1024} height={768} className="w-full h-auto object-cover" />
                    </div>
                )))}
        </div>
    )
}

export default Blocks