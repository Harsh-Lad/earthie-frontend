'use client'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Collection({ collection }) {
    const router = useRouter()

    if (!collection || !collection.collectionImage) {
        return null; // Render nothing if collection or collectionImage is undefined
    }

    const handleClick = () => {
        if (typeof localStorage !== 'undefined') {
            router.push(`collections/collectionName?collection_name=${collection.collectionName}`);
        }
    };

    return (
        <div className='h-96 w-80 shadow bg-[#f2f2f2] relative overflow-hidden my-4 mx-2'>
            <Image alt='' src={`${process.env.NEXT_PUBLIC_HOST}${collection.collectionImage}`} fill className='h-full w-full object-cover object-center' />
            <div className="content px-2 absolute bottom-0 w-full mb-4">
                <div className="bottom">
                    <Button className="rounded-none w-full text-lg py-6 mt-2 bg-[#030203] hover:bg-[#000000]" onClick={handleClick}>
                        {collection.collectionName} <MoveRight className='text-white ml-3' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Collection
