'use client'
import React, { Suspense, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

function SetPassword() {

  const auth = useSelector((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({

    token: token,
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    const { token, password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error('Please fill in all the required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await toast.promise(
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/set-password/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        })
          .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || 'Failed to reset password');
            }
            return data;
          })
          .then((data) => {
            toast.success(data.message);
            router.push('/login');
          }),
        {
          pending: 'Resetting password...',
          success: 'Password reset successfully!',
          error: (error) => `Failed to reset password: ${error.message}`,
        }
      );
    } catch (error) {
      toast.error(`Failed to reset password: ${error.message}`);
    }
  };
  return (
    <div className='w-screen h-screen relative'>
      <Image unoptimized src={loginImage} alt='' className='h-1/2 w-screen object-cover' />
      <div className="form w-[435px] h-3/5 shadow absolute bottom-0  bg-slate-50 rounded-md left-1/2 -translate-x-1/2 p-6 border-2">
        <p className="text-4xl font-bold">Set New Password !</p>
        <p className="text-md font-medium">Get back into your account...</p>


        <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
          <Label htmlFor="password">Password</Label>
          <Input type={showPassword ? "text" : "password"}
            id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
          <Label htmlFor="passwordc">Confirm Password</Label>
          <Input type={showPassword ? "text" : "password"}
            id="confirmPassword" placeholder="Password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Checkbox id="showPassword" onClick={() => { if (showPassword == true) { setShowPassword(false) } else { setShowPassword(true) } }} />

          <label
            htmlFor="showPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Show Password
          </label>
        </div>

        <div className="flex items-center justify-between my-2">
          <Link href={'/login'} className="text-sm font-medium mt-2">Remember your password, Login</Link>
        </div>
        <Button className="bg-[#030203] w-full rounded-none mt-3" onClick={handleSubmit}>Set Password</Button>
      </div>
    </div>
  )
}

function SuspendedSetPassword() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <SetPassword/>
      </Suspense>
  );
}

export default SuspendedSetPassword;
