import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo from '@/public/logo.png'
import Image from 'next/image'

function Login() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <Card className="w-1/4">
          <CardHeader>
            <div className="w-full flex justify-center">
              <Image alt='earthie logo' src={logo} unoptimized/>
            </div>
            <CardTitle className="text-center">Login to admin console</CardTitle>
            <CardDescription className="text-center">One stop solution to manage earthie fashion</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email Id</Label>
                  <Input id="email" placeholder="Enter your email id" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className='w-full'>Login</Button>
          </CardFooter>
        </Card>
      </div>
  )
}

export default Login