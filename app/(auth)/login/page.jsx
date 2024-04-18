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

function Login() {

  const auth = useSelector((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch()
  const router = useRouter()
  const anonymousId = typeof window !== 'undefined' ? localStorage.getItem('anonymous_id') : null;

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const { email, password } = formData;

    // Check if any field is empty
    if (!email || !password) {
      toast.error('Please fill in all the required fields');
      return;
    }


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });


      const data = await response.json();
      if (response.ok) {
        if (data.access) {
          localStorage.setItem('token', data.access);
          dispatch(login())

          if (anonymousId !== null) {
            console.log('this runs ');
            const assignResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/assignAnonToUser/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.access}` // Assuming access token is required for this endpoint
              },
              body: JSON.stringify({ anon: anonymousId }),
            });
            if (assignResponse.ok) {
              toast.success(`Login Successful!`);
              router.push('/')
              return;
            }
          }
          toast.success(`Login Successful!`);
          router.push('/')

        } else if (response.status == 401) {
          toast.error(data.detail || 'Login failed: Unexpected responsssse');
          toast.error(data);
        } else {
          toast.error(data.detail || 'Login failed: Unexpected response');
          toast.error(data);
        }


      }
    }
    catch (error) {
      toast.error(`Login failed this is catch: ${error}`);
    }
  };

  return (
    <div className='w-screen h-screen relative'>
      <Image src={loginImage} alt='' className='h-1/2 w-screen object-cover' />
      <div className="form w-full sm:w-[435px] h-3/5 shadow absolute bottom-0  bg-slate-50 rounded-md left-1/2 -translate-x-1/2 p-6 border-2">
        <p className="text-[26px] sm:text-4xl  font-bold">Welcome Back !</p>
        <p className="text-md font-medium">Get back into your account...</p>

        <div className="grid w-full items-center gap-1.5 mt-5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="grid w-full items-center gap-1.5 mt-3">
          <Label htmlFor="password">Password</Label>
          <Input type={showPassword ? "text" : "password"}
            id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
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

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between  my-2">
          <Link href={'/forgot-password'} className="text-sm font-medium mt-2">Forgot your password ?</Link>
          <Link href={'/signup'} className="text-sm font-medium mt-2">Create an account</Link>
        </div>
        <Button className="bg-[#030203] w-full rounded-none mt-3" type="submit" onClick={handleSubmit}>Login</Button>
      </div>
    </div>
  )
}

export default Login;
