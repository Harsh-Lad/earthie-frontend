'use client'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

function EmailSent() {
    
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
    return (
        <div className='min-h-screen container pt-36 flex items-start justify-center'>
            <div className="flex flex-col items-center">
                <div className="p-5 bg-green-200 rounded-full aspect-square flex items-center justify-center animate-pulse h-44 w-44">
                    <Mail className='text-green-700 h-24 w-32' />
                </div>
                <p className="text-3xl font-semibold mt-4 text-center">Please Verify Your Email</p>
                <p className='text-center mt-2 font-medium' >You&apos;re almost there! We sent an email to <br />
                    {email}
                </p>

                <p className='text-center mt-3 font-medium'>Just click on the link in that email to complete your signup.  <br /> If you don&apos;t
                    see it, you may need to <b>check your spam</b> folder.</p>
            </div>
        </div>
    )
}

function SuspendedEmailSent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailSent/>
        </Suspense>
    );
}
export default SuspendedEmailSent