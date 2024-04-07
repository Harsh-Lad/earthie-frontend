'use client'
import { MailCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react'
import { toast } from 'react-toastify';

function VerifyEmail() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter()

    async function verify() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/verify-email/${token}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();

            console.log(responseData);

            if (response.ok) {
                if (responseData.data === 'Email verified successfully. Please login.') {
                    toast.success(responseData.data);
                    router.push('/login');
                } else if (responseData.data === 'Email already verified. Please login.') {
                    toast.warning(responseData.data);
                    router.push('/login');
                } else {
                    // Handle unexpected success response
                    toast.error('An unexpected error occurred. Please try again.');
                }
            } else {
                if (responseData.data === 'Email not found') {
                    toast.error('Email not found.');
                } else {
                    // Handle other error messages
                    toast.error(responseData.data);
                }
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error:', error);
            toast.error('An error occurred while verifying email. Please try again.');
        }
    }

    useEffect(() => {
        verify()
    }, [])
    return (

        <div className='min-h-screen pt-36'>
            <div className="flex flex-col items-center">
                <div className="p-5 bg-green-200 rounded-full aspect-square flex items-center justify-center animate-pulse h-44 w-44">
                    <MailCheck className='text-green-700 h-24 w-32' />
                </div>
                <p className="text-3xl font-semibold mt-4 text-center">Email Verified Successfully</p>
                <p className='text-center mt-2 font-medium' > Login to continue
                </p>
            </div>
        </div>
    )
}


export default VerifyEmail