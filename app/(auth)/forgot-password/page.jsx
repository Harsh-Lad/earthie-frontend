'use client'
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-toastify';
import Image from 'next/image';
import loginImage from '@/public/login.png';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/auth/authSlice';
import { useRouter } from 'next/navigation';

function ForgotPass() {
  const [email, setEmail] = useState('');
  const router = useRouter();


  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password. Please try again.');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      throw error.message || 'An error occurred while resetting password. Please try again.';
    }
  };

  const handleResetPassword = async () => {
    try {
      toast.info('Sending reset password email...');
      const message = await handleSubmit();
      toast.success(message);
      router.push(`/passemailsent?email=${email}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className='w-screen h-screen relative'>
      <Image unoptimized src={loginImage} alt='' className='h-1/2 w-screen object-cover' />
      <div className="form w-full sm:w-[435px] h-3/5 shadow absolute bottom-0  bg-slate-50 rounded-md left-1/2 -translate-x-1/2 p-6 border-2">
        <p className="text-[26px] sm:text-4xl  font-bold">Forgot Password !</p>
        <p className="text-md font-medium">Enter your registerd email...</p>

        <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </div>



        <div className="flex items-center justify-between my-2">
          <Link href={'/signup'} className="text-sm font-medium mt-2">Create an account</Link>
        </div>
        <Button className="bg-[#030203] w-full rounded-none mt-3" onClick={handleResetPassword}>Reset Password</Button>
      </div>
    </div>
  )
}

export default ForgotPass;
