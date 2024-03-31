'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import signup from '@/public/signup.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'


function Signup() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        cPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault(); // Prevent default form submission

        // Destructure form data
        const { name, email, phone_number, password, cPassword } = formData;

        // Check if any field is empty
        if (!name || !email || !phone_number || !password || !cPassword) {
            toast.error('Please fill in all the required fields');
            return;
        }


        if (formData.password !== formData.cPassword) {
            // Handle password mismatch error
            console.error('Passwords do not match!');
            toast.error("Passwords do not match!")
            return;
        }

        toast.promise(
            fetch(`${process.env.NEXT_PUBLIC_HOST}/api/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            }),
            {
                pending: 'Registering...',
                success: 'Registration Successful!',
                error: ({ response }) =>
                    response ? `Registration failed: ${response.statusText}` : 'Network error',
            }
        )
            .then((response) => {
                console.log('Registration successful!', response);
                router.push(`/emailsent?email=${formData.email}`); // Redirect to OTP page after successful registration
            })
            .catch((error) => {
                console.error('Registration failed:', error);
            });
    };

    return (
        <div className='w-screen h-screen relative'>
            <Image unoptimized src={signup} alt='' className='h-1/2 w-screen object-cover' />
            <div className="form w-[435px] h-auto shadow absolute bottom-0 bg-slate-50  rounded-md left-1/2 -translate-x-1/2 p-6 border-2">
                <p className="text-4xl font-bold">Welcome to Earthie !</p>
                <p className="text-md font-medium">Join the Earthie Community...</p>

                <form action="" onSubmit={handleSubmit}>

                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />

                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input type="tel" id="phone" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                        <Label htmlFor="password">Password</Label>
                        <Input type={showPassword ? "text" : "password"}
                            id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                        <Label htmlFor="cpassword">Confirm Password</Label>
                        <Input type={showPassword ? "text" : "password"}
                            id="cpassword" name="cPassword" placeholder="Confirm Password" value={formData.cPassword} onChange={handleChange} />

                    </div>
                </form>


                <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="terms" onClick={() => { if (showPassword == true) { setShowPassword(false) } else { setShowPassword(true) } }} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        Show Password
                    </label>
                </div>

                <div className="flex items-center  my-2">
                    <p className="text-sm font-medium mt-2">Already have an account?</p>
                    <Link href={'/login'} className="text-sm font-medium mt-2">&nbsp; Login</Link>
                </div>
                <Button className="bg-[#030203] w-full rounded-none mt-3" type="submit" onClick={handleSubmit} >Signup</Button>
            </div>
        </div>
    )
}

export default Signup