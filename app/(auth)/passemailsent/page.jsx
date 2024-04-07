'use client'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

function PassEmailSent() {
    
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
    return (
        <div className='min-h-screen container pt-36 flex items-start justify-center'>
            <div className="flex flex-col items-center">
                <div className="p-5 bg-green-200 rounded-full aspect-square flex items-center justify-center animate-pulse h-44 w-44">
                    <Mail className='text-green-700 h-24 w-32' />
                </div>
                <p className="text-3xl font-semibold mt-4 text-center">Password Reset Email Sent Successfully</p>
                <p className='text-center mt-2 font-medium' >You&apos;re almost there! We sent an email to <br />
                    {email}
                </p>

                <p className='text-center mt-3 font-medium'>Just click on the link in that email to reset your password.  <br /> If you don&apos;t
                    see it, you may need to <b>check your spam</b> folder.</p>
            </div>
        </div>
    )
}



export default PassEmailSent